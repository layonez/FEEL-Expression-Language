/**
 * Represents a position in a text document
 */
export interface Position {
  line: number;
  character: number;
}

/**
 * Represents a range in a text document
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Severity levels for diagnostics
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

/**
 * Represents a diagnostic message (error, warning, etc.)
 */
export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  message: string;
  source?: string;
}

/**
 * Information about a FEEL built-in function
 */
export interface BuiltInFunction {
  name: string;
  signature: string;
  description: string;
  parameters: BuiltInParameter[];
  returnType?: string;
}

/**
 * Parameter information for a built-in function
 */
export interface BuiltInParameter {
  name: string;
  type: string;
  optional?: boolean;
  description?: string;
}

/**
 * Parse result from the FEEL parser
 */
export interface ParseResult {
  tree: any; // Lezer tree
  diagnostics: Diagnostic[];
}
