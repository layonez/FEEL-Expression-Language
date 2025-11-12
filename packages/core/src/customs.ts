import { BuiltInFunction } from './types';

export const customFunctions: BuiltInFunction[] = [
  // ========================================
  // Network / HTTP
  // ========================================
  {
    name: 'httpCall',
    signature: 'httpCall(method: string, endpoint: string, headers: context, body?: any, config?: context): context',
    description: 'Executes an HTTP request and returns a response context with statusCode, headers, and body.',
    parameters: [
      { name: 'method', type: 'string', description: 'HTTP method verb: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD.' },
      { name: 'endpoint', type: 'string', description: 'Absolute HTTP(S) endpoint or spm:/// path.' },
      { name: 'headers', type: 'context', description: 'Request headers (single value per key). "Authorization" may reference config credentials.' },
      { name: 'body', type: 'any', description: 'Request body (context or string), required if Content-Type header set.', optional: true },
      { name: 'config', type: 'context', description: 'Extra execution options (see ExtraConfig in Java implementation).', optional: true }
    ],
    returnType: 'context'
  },
  // ========================================
  // JSON Parsing
  // ========================================
  {
    name: 'parseJson',
    signature: 'parseJson(json: string): any',
    description: 'Parses a JSON string producing a FEEL value (literal, list, or context).',
    parameters: [
      { name: 'json', type: 'string', description: 'JSON string to parse.' }
    ],
    returnType: 'any'
  },
  {
    name: 'parseJson',
    signature: 'parseJson(json: string, path: string): any',
    description: 'Parses a JSON string and extracts the value at a JSON Pointer path.',
    parameters: [
      { name: 'json', type: 'string', description: 'JSON string to parse.' },
      { name: 'path', type: 'string', description: 'JSON Pointer (RFC 6901) path to extract.' }
    ],
    returnType: 'any'
  },
  {
    name: 'parseJson',
    signature: 'parseJson(json: string, keep: context<string, string>): context',
    description: 'Parses a JSON string and builds a new context from selected JSON Pointer paths.',
    parameters: [
      { name: 'json', type: 'string', description: 'JSON string to parse.' },
      { name: 'keep', type: 'context<string, string>', description: 'Mapping of output keys to JSON Pointer paths.' }
    ],
    returnType: 'context'
  },
  // ========================================
  // Assertions & Validation
  // ========================================
  {
    name: 'validate',
    signature: 'validate(validation: context): any',
    description: 'Validates a context containing value, retry (boolean), and optional assert predicates; returns value if all pass.',
    parameters: [
      { name: 'validation', type: 'context', description: 'Context with keys: value (any), retry (boolean), assert (context of message: boolean).' }
    ],
    returnType: 'any'
  },
  {
    name: 'assert',
    signature: 'assert(message: string, predicate: boolean): boolean',
    description: 'Throws an assertion error with message if predicate is false; returns true otherwise.',
    parameters: [
      { name: 'message', type: 'string', description: 'Error message if predicate fails.' },
      { name: 'predicate', type: 'boolean', description: 'Condition to validate.' }
    ],
    returnType: 'boolean'
  },
  {
    name: 'assert',
    signature: 'assert(assertions: context<string, boolean>): boolean',
    description: 'Sequentially validates multiple predicates (message -> boolean); throws on first failure, returns true if all succeed.',
    parameters: [
      { name: 'assertions', type: 'context<string, boolean>', description: 'Context mapping messages to predicates.' }
    ],
    returnType: 'boolean'
  },
  {
    name: 'retry',
    signature: 'retry(message: string): boolean',
    description: 'Throws a retryable assertion error with the given message (never returns normally).',
    parameters: [
      { name: 'message', type: 'string', description: 'Retryable error message.' }
    ],
    returnType: 'boolean'
  },
  {
    name: 'fail',
    signature: 'fail(message: string): boolean',
    description: 'Throws a non-retryable assertion error with the given message (never returns normally).',
    parameters: [
      { name: 'message', type: 'string', description: 'Failure error message.' }
    ],
    returnType: 'boolean'
  },
  // ========================================
  // Encoding Utilities
  // ========================================
  {
    name: 'urlEncode',
    signature: 'urlEncode(value: string): string',
    description: 'URL-encodes the given string using UTF-8.',
    parameters: [
      { name: 'value', type: 'string', description: 'String to URL encode.' }
    ],
    returnType: 'string'
  }
];

