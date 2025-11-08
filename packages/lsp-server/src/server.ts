import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  Connection,
  Hover,
  MarkupKind,
  CompletionItem,
  CompletionItemKind,
  SemanticTokensBuilder,
  SemanticTokensLegend,
} from 'vscode-languageserver/node.js';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { parse, getBuiltInFunction, getBuiltInFunctionNames } from '@feel/core';

/**
 * Server configuration
 */
interface ServerSettings {
  dialect?: string;
  maxFileSize?: number;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Semantic token types and modifiers
 */
const tokenTypes = ['keyword', 'function', 'method', 'parameter', 'variable', 'number', 'string', 'comment', 'operator'];
const tokenModifiers = ['declaration', 'defaultLibrary', 'readonly'];

const tokenLegend: SemanticTokensLegend = {
  tokenTypes,
  tokenModifiers,
};

/**
 * FEEL keywords for completion
 */
const keywords = [
  'if',
  'then',
  'else',
  'for',
  'in',
  'return',
  'some',
  'every',
  'satisfies',
  'function',
  'true',
  'false',
  'null',
  'not',
  'and',
  'or',
  'between',
  'instance',
  'of',
];

/**
 * Creates and starts the FEEL LSP server
 */
export function createServer(): Connection {
  // Create a connection for the server
  const connection = createConnection(ProposedFeatures.all);

  // Create a document manager
  const documents = new TextDocuments(TextDocument);

  let settings: ServerSettings = {
    dialect: 'standard',
    maxFileSize: 1024 * 1024, // 1MB
    logLevel: 'debug',
  };

  connection.onInitialize((params: InitializeParams): InitializeResult => {
    connection.console.log('FEEL LSP Server initializing...');
    connection.console.log(`Client capabilities: ${JSON.stringify(params.capabilities.textDocument?.semanticTokens)}`);

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        hoverProvider: true,
        completionProvider: {
          triggerCharacters: [' ', '(', '[', '{'],
        },
        semanticTokensProvider: {
          legend: tokenLegend,
          full: true,
        },
      },
    };

    connection.console.log(`Server semantic tokens capability: ${JSON.stringify(result.capabilities.semanticTokensProvider)}`);
    return result;
  });

  connection.onInitialized(() => {
    connection.console.log('FEEL LSP Server initialized');
  });

  // Configuration change handler
  connection.onDidChangeConfiguration((change) => {
    settings = change.settings?.feel || settings;
    connection.console.log(`Configuration updated: ${JSON.stringify(settings)}`);

    // Re-validate all open documents
    documents.all().forEach(validateTextDocument);
  });

  // Document change handlers
  documents.onDidChangeContent((change) => {
    validateTextDocument(change.document);
  });

  documents.onDidOpen((event) => {
    connection.console.log(`Document opened: ${event.document.uri}`);
    validateTextDocument(event.document);
  });

  documents.onDidSave((event) => {
    connection.console.log(`Document saved: ${event.document.uri}`);
    validateTextDocument(event.document);
  });

  /**
   * Validates a text document and sends diagnostics
   */
  function validateTextDocument(textDocument: TextDocument): void {
    const text = textDocument.getText();

    // Check file size limit
    if (settings.maxFileSize && text.length > settings.maxFileSize) {
      connection.console.warn(`Document ${textDocument.uri} exceeds max file size`);
      return;
    }

    // Parse and get diagnostics
    const result = parse(text);

    // Convert our diagnostics to LSP diagnostics
    const diagnostics = result.diagnostics.map((diag) => ({
      severity: diag.severity,
      range: {
        start: {
          line: diag.range.start.line,
          character: diag.range.start.character,
        },
        end: {
          line: diag.range.end.line,
          character: diag.range.end.character,
        },
      },
      message: diag.message,
      source: diag.source || 'feel-lsp',
    }));

    // Send diagnostics to client
    connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics,
    });
  }

  /**
   * Hover provider - shows information about built-in functions
   */
  connection.onHover((params): Hover | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return null;
    }

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    // Extract word at position (simplified)
    const wordRange = getWordRangeAtPosition(text, offset);
    if (!wordRange) {
      return null;
    }

    const word = text.substring(wordRange.start, wordRange.end);

    // Check if it's a built-in function
    const builtIn = getBuiltInFunction(word);
    if (builtIn) {
      const contents = [
        `**${builtIn.name}**`,
        '',
        '```feel',
        builtIn.signature,
        '```',
        '',
        builtIn.description,
      ];

      if (builtIn.parameters.length > 0) {
        contents.push('', '**Parameters:**');
        builtIn.parameters.forEach((param) => {
          const optional = param.optional ? ' (optional)' : '';
          contents.push(
            `- \`${param.name}\`: ${param.type}${optional}${param.description ? ' - ' + param.description : ''}`
          );
        });
      }

      if (builtIn.returnType) {
        contents.push('', `**Returns:** ${builtIn.returnType}`);
      }

      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: contents.join('\n'),
        },
      };
    }

    return null;
  });

  /**
   * Completion provider - provides keyword and built-in function completions
   */
  connection.onCompletion((_params): CompletionItem[] => {
    const completions: CompletionItem[] = [];

    // Add keyword completions
    keywords.forEach((keyword) => {
      completions.push({
        label: keyword,
        kind: CompletionItemKind.Keyword,
        detail: 'FEEL keyword',
      });
    });

    // Add built-in function completions
    const builtInNames = getBuiltInFunctionNames();
    builtInNames.forEach((name) => {
      const fn = getBuiltInFunction(name);
      if (fn) {
        completions.push({
          label: name,
          kind: CompletionItemKind.Function,
          detail: fn.signature,
          documentation: {
            kind: MarkupKind.Markdown,
            value: fn.description,
          },
        });
      }
    });

    return completions;
  });

  /**
   * Completion item resolve - provides additional details for completion items
   */
  connection.onCompletionResolve((item): CompletionItem => {
    // Can add more details here if needed
    return item;
  });

  /**
   * Semantic tokens provider - provides syntax highlighting
   */
  connection.languages.semanticTokens.on((params) => {
    connection.console.log(`Semantic tokens requested for: ${params.textDocument.uri}`);
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      connection.console.log('Document not found!');
      return { data: [] };
    }

    const text = document.getText();
    connection.console.log(`Document text length: ${text.length} characters`);
    const builder = new SemanticTokensBuilder();

    // Simple token detection using regex
    // Keywords
    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    let match;
    while ((match = keywordPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      builder.push(pos.line, pos.character, match[0].length, tokenTypes.indexOf('keyword'), 0);
    }

    // Built-in functions - mark with defaultLibrary modifier for visual distinction
    const builtInNames = getBuiltInFunctionNames();
    const functionPattern = new RegExp(`\\b(${builtInNames.map(escapeRegex).join('|')})\\b`, 'g');
    while ((match = functionPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      const modifiers = 1 << tokenModifiers.indexOf('defaultLibrary'); // Set defaultLibrary bit flag
      builder.push(pos.line, pos.character, match[0].length, tokenTypes.indexOf('function'), modifiers);
    }

    // Numbers
    const numberPattern = /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g;
    while ((match = numberPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      builder.push(pos.line, pos.character, match[0].length, tokenTypes.indexOf('number'), 0);
    }

    // Strings
    const stringPattern = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
    while ((match = stringPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      builder.push(pos.line, pos.character, match[0].length, tokenTypes.indexOf('string'), 0);
    }

    // Comments
    const lineCommentPattern = /\/\/.*/g;
    while ((match = lineCommentPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      builder.push(pos.line, pos.character, match[0].length, tokenTypes.indexOf('comment'), 0);
    }

    const blockCommentPattern = /\/\*[\s\S]*?\*\//g;
    while ((match = blockCommentPattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      const lines = match[0].split('\n');
      for (let i = 0; i < lines.length; i++) {
        const linePos = { line: pos.line + i, character: i === 0 ? pos.character : 0 };
        builder.push(linePos.line, linePos.character, lines[i].length, tokenTypes.indexOf('comment'), 0);
      }
    }

    const result = builder.build();
    connection.console.log(`Built ${result.data.length} token values (${result.data.length / 5} tokens)`);
    connection.console.log(`First 50 values: ${result.data.slice(0, 50).join(', ')}`);
    return result;
  });

  // Listen on the connection
  documents.listen(connection);
  connection.listen();

  return connection;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gets the word range at a given offset
 */
function getWordRangeAtPosition(
  text: string,
  offset: number
): { start: number; end: number } | null {
  if (offset < 0 || offset > text.length) {
    return null;
  }

  // Word characters include letters, numbers, spaces, and underscores for FEEL identifiers
  const wordPattern = /[a-zA-Z0-9_ ]+/g;

  let match: RegExpExecArray | null;
  while ((match = wordPattern.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (offset >= start && offset <= end) {
      // Trim spaces from the matched word
      const word = match[0];
      const trimStart = word.length - word.trimStart().length;
      const trimEnd = word.length - word.trimEnd().length;

      return {
        start: start + trimStart,
        end: end - trimEnd,
      };
    }
  }

  return null;
}
