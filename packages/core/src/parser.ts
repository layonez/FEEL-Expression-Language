import { parser } from 'lezer-feel';
import { Diagnostic, DiagnosticSeverity, ParseResult, Position } from './types.js';

/**
 * Parses FEEL expression and returns parse tree with diagnostics
 */
export function parse(input: string): ParseResult {
  const tree = parser.parse(input);
  const diagnostics: Diagnostic[] = [];

  // Extract syntax errors from the parse tree
  tree.iterate({
    enter: (node) => {
      if (node.type.isError) {
        const from = node.from;
        const to = node.to;

        diagnostics.push({
          range: {
            start: offsetToPosition(input, from),
            end: offsetToPosition(input, to),
          },
          severity: DiagnosticSeverity.Error,
          message: 'Syntax error',
          source: 'feel-parser',
        });
      }
    },
  });

  return { tree, diagnostics };
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
