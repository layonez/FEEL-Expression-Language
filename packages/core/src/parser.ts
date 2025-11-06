import { parser } from 'lezer-feel';
import { SyntaxNode, Tree } from '@lezer/common';
import { Diagnostic, DiagnosticSeverity, ParseResult, Position } from './types.js';
import { getBuiltInFunction } from './builtins.js';

/**
 * Parses FEEL expression and returns parse tree with diagnostics
 */
export function parse(input: string): ParseResult {
  const tree = parser.parse(input);
  const diagnostics: Diagnostic[] = [];

  // Extract syntax errors from the parse tree using cursor iteration
  // Pattern adapted from feel-playground's Linting.js
  tree.cursor().iterate((node) => {
    if (!node.type.isError) {
      return;
    }

    const error = lintError(node.node, input);

    diagnostics.push({
      range: {
        start: offsetToPosition(input, error.from),
        end: offsetToPosition(input, error.to),
      },
      severity: DiagnosticSeverity.Error,
      message: error.message,
      source: 'feel-parser',
    });
  });

  // Add semantic validation for function calls
  const semanticDiagnostics = validateFunctions(tree, input);
  diagnostics.push(...semanticDiagnostics);

  return { tree, diagnostics };
}

/**
 * Generate error message for syntax errors
 */
function lintError(
  node: SyntaxNode,
  _text: string
): { from: number; to: number; message: string } {
  const parent = node.parent;

  if (node.from !== node.to) {
    return {
      from: node.from,
      to: node.to,
      message: `Unrecognized token in <${parent?.name || 'expression'}>`,
    };
  }

  const next = findNext(node);

  if (next) {
    return {
      from: node.from,
      to: next.to,
      message: `Unrecognized token <${next.name}> in <${parent?.name || 'expression'}>`,
    };
  } else {
    const unfinished = parent?.enterUnfinishedNodesBefore(node.to);

    return {
      from: node.from,
      to: node.to,
      message: `Incomplete <${(unfinished || parent)?.name || 'expression'}>`,
    };
  }
}

/**
 * Find the next sibling node, traversing up the tree if necessary
 */
function findNext(node: SyntaxNode): SyntaxNode | null {
  let next,
    parent: SyntaxNode | null = node;

  do {
    next = parent.nextSibling;

    if (next) {
      return next;
    }

    parent = parent.parent;
  } while (parent);

  return null;
}

/**
 * Converts a text offset to line/character position
 */
function offsetToPosition(text: string, offset: number): Position {
  const lines = text.substring(0, offset).split('\n');
  return {
    line: lines.length - 1,
    character: lines[lines.length - 1].length,
  };
}

/**
 * Converts line/character position to text offset
 */
export function positionToOffset(text: string, position: Position): number {
  const lines = text.split('\n');
  let offset = 0;

  for (let i = 0; i < position.line && i < lines.length; i++) {
    offset += lines[i].length + 1; // +1 for newline
  }

  offset += Math.min(position.character, lines[position.line]?.length || 0);
  return offset;
}

/**
 * Validates function calls, checking against built-ins
 */
function validateFunctions(tree: Tree, text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  /**
   * Extract the name from a node
   */
  function extractName(node: SyntaxNode): string {
    return text.substring(node.from, node.to);
  }

  /**
   * Check if a name is a built-in function
   */
  function isBuiltIn(name: string): boolean {
    return getBuiltInFunction(name) !== undefined;
  }

  // Validate function invocations
  tree.cursor().iterate((nodeRef) => {
    const node = nodeRef.node;
    const nodeType = node.type.name;

    if (nodeType === 'FunctionInvocation') {
      // Check function calls
      // Function name is typically the first child or can be extracted from the node range
      let funcNameNode = node.firstChild;

      // Skip whitespace/comments, get the actual name
      while (funcNameNode && (funcNameNode.type.name === 'Whitespace' || funcNameNode.type.name === 'Comment')) {
        funcNameNode = funcNameNode.nextSibling;
      }

      if (funcNameNode) {
        // The function name might be a QualifiedName or just a Name
        let funcName: string;

        if (funcNameNode.type.name === 'QualifiedName') {
          // For qualified names, get the full text
          funcName = extractName(funcNameNode);
        } else {
          // For simple names, just extract
          funcName = extractName(funcNameNode);
        }

        // Check if it's a built-in function
        if (!isBuiltIn(funcName)) {
          diagnostics.push({
            range: {
              start: offsetToPosition(text, funcNameNode.from),
              end: offsetToPosition(text, funcNameNode.to),
            },
            severity: DiagnosticSeverity.Warning,
            message: `Unknown function: '${funcName}'`,
            source: 'feel-semantic',
          });
        }
      }
    }
  });

  return diagnostics;
}
