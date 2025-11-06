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

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        hoverProvider: true,
      },
    };
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

  // Listen on the connection
  documents.listen(connection);
  connection.listen();

  return connection;
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
