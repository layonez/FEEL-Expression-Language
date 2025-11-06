import { parser } from 'lezer-feel';
import { SyntaxNode } from '@lezer/common';
import { Diagnostic, DiagnosticSeverity, ParseResult, Position } from './types.js';

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
