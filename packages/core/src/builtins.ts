import { BuiltInFunction } from './types.js';

/**
 * Metadata for FEEL built-in functions
 * Based on DMN 1.3 specification
 *
 * Note: While the `feelin` library contains the actual built-in function
 * implementations, it does not export metadata with descriptions suitable
 * for LSP hover information. This file provides rich documentation for
 * each built-in function to enhance the developer experience.
 *
 * Reference: https://github.com/nikku/feelin/blob/main/src/builtins.ts
 */
export const builtInFunctions: BuiltInFunction[] = [
  {
    name: 'date',
    signature: 'date(from: string | date and time): date',
    description: 'Returns a date from a string or date and time value',
    parameters: [
      {
        name: 'from',
        type: 'string | date and time',
        description: 'A date string or date and time value',
      },
    ],
    returnType: 'date',
  },
  {
    name: 'date',
    signature: 'date(year: number, month: number, day: number): date',
    description: 'Creates a date from year, month, and day components',
    parameters: [
      { name: 'year', type: 'number', description: 'Year component' },
      { name: 'month', type: 'number', description: 'Month component (1-12)' },
      { name: 'day', type: 'number', description: 'Day component (1-31)' },
    ],
    returnType: 'date',
  },
  {
    name: 'time',
    signature: 'time(from: string): time',
    description: 'Returns a time from a string',
    parameters: [
      { name: 'from', type: 'string', description: 'A time string' },
    ],
    returnType: 'time',
  },
  {
    name: 'time',
    signature: 'time(hour: number, minute: number, second: number): time',
    description: 'Creates a time from hour, minute, and second components',
    parameters: [
      { name: 'hour', type: 'number', description: 'Hour component (0-23)' },
      { name: 'minute', type: 'number', description: 'Minute component (0-59)' },
      { name: 'second', type: 'number', description: 'Second component (0-59)' },
    ],
    returnType: 'time',
  },
  {
    name: 'date and time',
    signature: 'date and time(date: date, time: time): date and time',
    description: 'Creates a date and time from separate date and time values',
    parameters: [
      { name: 'date', type: 'date', description: 'Date component' },
      { name: 'time', type: 'time', description: 'Time component' },
    ],
    returnType: 'date and time',
  },
  {
    name: 'duration',
    signature: 'duration(from: string): duration',
    description: 'Returns a duration from a string',
    parameters: [
      { name: 'from', type: 'string', description: 'A duration string (e.g., "P1D", "PT2H")' },
    ],
    returnType: 'duration',
  },
  {
    name: 'string',
    signature: 'string(from: any): string',
    description: 'Converts a value to a string',
    parameters: [
      { name: 'from', type: 'any', description: 'Value to convert' },
    ],
    returnType: 'string',
  },
  {
    name: 'number',
    signature: 'number(from: string, grouping separator: string, decimal separator: string): number',
    description: 'Converts a string to a number',
    parameters: [
      { name: 'from', type: 'string', description: 'String to convert' },
      { name: 'grouping separator', type: 'string', optional: true, description: 'Character used for grouping' },
      { name: 'decimal separator', type: 'string', optional: true, description: 'Character used for decimal point' },
    ],
    returnType: 'number',
  },
  {
    name: 'substring',
    signature: 'substring(string: string, start position: number, length?: number): string',
    description: 'Returns a substring',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
      { name: 'start position', type: 'number', description: 'Starting position (1-indexed)' },
      { name: 'length', type: 'number', optional: true, description: 'Length of substring' },
    ],
    returnType: 'string',
  },
  {
    name: 'string length',
    signature: 'string length(string: string): number',
    description: 'Returns the length of a string',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
    ],
    returnType: 'number',
  },
  {
    name: 'upper case',
    signature: 'upper case(string: string): string',
    description: 'Converts string to uppercase',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
    ],
    returnType: 'string',
  },
  {
    name: 'lower case',
    signature: 'lower case(string: string): string',
    description: 'Converts string to lowercase',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
    ],
    returnType: 'string',
  },
  {
    name: 'contains',
    signature: 'contains(string: string, match: string): boolean',
    description: 'Tests if string contains match',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
      { name: 'match', type: 'string', description: 'String to find' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'starts with',
    signature: 'starts with(string: string, match: string): boolean',
    description: 'Tests if string starts with match',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
      { name: 'match', type: 'string', description: 'Prefix to test' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'ends with',
    signature: 'ends with(string: string, match: string): boolean',
    description: 'Tests if string ends with match',
    parameters: [
      { name: 'string', type: 'string', description: 'Source string' },
      { name: 'match', type: 'string', description: 'Suffix to test' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'matches',
    signature: 'matches(input: string, pattern: string, flags?: string): boolean',
    description: 'Tests if input matches a regex pattern',
    parameters: [
      { name: 'input', type: 'string', description: 'String to test' },
      { name: 'pattern', type: 'string', description: 'Regex pattern' },
      { name: 'flags', type: 'string', optional: true, description: 'Regex flags' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'list contains',
    signature: 'list contains(list: list, element: any): boolean',
    description: 'Tests if list contains element',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'element', type: 'any', description: 'Element to find' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'count',
    signature: 'count(list: list): number',
    description: 'Returns the number of elements in a list',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
    ],
    returnType: 'number',
  },
  {
    name: 'min',
    signature: 'min(list: list): number',
    description: 'Returns the minimum value in a list',
    parameters: [
      { name: 'list', type: 'list', description: 'List of numbers' },
    ],
    returnType: 'number',
  },
  {
    name: 'max',
    signature: 'max(list: list): number',
    description: 'Returns the maximum value in a list',
    parameters: [
      { name: 'list', type: 'list', description: 'List of numbers' },
    ],
    returnType: 'number',
  },
  {
    name: 'sum',
    signature: 'sum(list: list): number',
    description: 'Returns the sum of values in a list',
    parameters: [
      { name: 'list', type: 'list', description: 'List of numbers' },
    ],
    returnType: 'number',
  },
  {
    name: 'mean',
    signature: 'mean(list: list): number',
    description: 'Returns the arithmetic mean of values in a list',
    parameters: [
      { name: 'list', type: 'list', description: 'List of numbers' },
    ],
    returnType: 'number',
  },
  {
    name: 'all',
    signature: 'all(list: list): boolean',
    description: 'Returns true if all elements in list are true',
    parameters: [
      { name: 'list', type: 'list', description: 'List of boolean values' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'any',
    signature: 'any(list: list): boolean',
    description: 'Returns true if any element in list is true',
    parameters: [
      { name: 'list', type: 'list', description: 'List of boolean values' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'sublist',
    signature: 'sublist(list: list, start position: number, length?: number): list',
    description: 'Returns a sublist',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'start position', type: 'number', description: 'Starting position (1-indexed)' },
      { name: 'length', type: 'number', optional: true, description: 'Length of sublist' },
    ],
    returnType: 'list',
  },
  {
    name: 'append',
    signature: 'append(list: list, items...): list',
    description: 'Returns a new list with items appended',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'items', type: 'any', description: 'Items to append' },
    ],
    returnType: 'list',
  },
  {
    name: 'concatenate',
    signature: 'concatenate(lists...): list',
    description: 'Concatenates multiple lists',
    parameters: [
      { name: 'lists', type: 'list', description: 'Lists to concatenate' },
    ],
    returnType: 'list',
  },
  {
    name: 'insert before',
    signature: 'insert before(list: list, position: number, newItem: any): list',
    description: 'Inserts an item before a position',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'position', type: 'number', description: 'Position to insert before (1-indexed)' },
      { name: 'newItem', type: 'any', description: 'Item to insert' },
    ],
    returnType: 'list',
  },
  {
    name: 'remove',
    signature: 'remove(list: list, position: number): list',
    description: 'Removes an item at a position',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'position', type: 'number', description: 'Position to remove (1-indexed)' },
    ],
    returnType: 'list',
  },
  {
    name: 'reverse',
    signature: 'reverse(list: list): list',
    description: 'Reverses a list',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
    ],
    returnType: 'list',
  },
  {
    name: 'index of',
    signature: 'index of(list: list, match: any): list',
    description: 'Returns positions of matching elements',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
      { name: 'match', type: 'any', description: 'Element to find' },
    ],
    returnType: 'list',
  },
  {
    name: 'union',
    signature: 'union(lists...): list',
    description: 'Returns the union of multiple lists',
    parameters: [
      { name: 'lists', type: 'list', description: 'Lists to unite' },
    ],
    returnType: 'list',
  },
  {
    name: 'distinct values',
    signature: 'distinct values(list: list): list',
    description: 'Returns a list with duplicates removed',
    parameters: [
      { name: 'list', type: 'list', description: 'Source list' },
    ],
    returnType: 'list',
  },
  {
    name: 'flatten',
    signature: 'flatten(list: list): list',
    description: 'Flattens nested lists',
    parameters: [
      { name: 'list', type: 'list', description: 'Nested list' },
    ],
    returnType: 'list',
  },
  {
    name: 'sort',
    signature: 'sort(list: list, precedes: function): list',
    description: 'Sorts a list using a comparison function',
    parameters: [
      { name: 'list', type: 'list', description: 'List to sort' },
      { name: 'precedes', type: 'function', description: 'Comparison function' },
    ],
    returnType: 'list',
  },
  {
    name: 'decimal',
    signature: 'decimal(n: number, scale: number): number',
    description: 'Returns a decimal number with specified scale',
    parameters: [
      { name: 'n', type: 'number', description: 'Number to scale' },
      { name: 'scale', type: 'number', description: 'Number of decimal places' },
    ],
    returnType: 'number',
  },
  {
    name: 'floor',
    signature: 'floor(n: number): number',
    description: 'Returns the largest integer less than or equal to n',
    parameters: [
      { name: 'n', type: 'number', description: 'Number to floor' },
    ],
    returnType: 'number',
  },
  {
    name: 'ceiling',
    signature: 'ceiling(n: number): number',
    description: 'Returns the smallest integer greater than or equal to n',
    parameters: [
      { name: 'n', type: 'number', description: 'Number to ceiling' },
    ],
    returnType: 'number',
  },
  {
    name: 'abs',
    signature: 'abs(n: number): number',
    description: 'Returns the absolute value',
    parameters: [
      { name: 'n', type: 'number', description: 'Number' },
    ],
    returnType: 'number',
  },
  {
    name: 'modulo',
    signature: 'modulo(dividend: number, divisor: number): number',
    description: 'Returns the modulo (remainder)',
    parameters: [
      { name: 'dividend', type: 'number', description: 'Dividend' },
      { name: 'divisor', type: 'number', description: 'Divisor' },
    ],
    returnType: 'number',
  },
  {
    name: 'sqrt',
    signature: 'sqrt(n: number): number',
    description: 'Returns the square root',
    parameters: [
      { name: 'n', type: 'number', description: 'Number' },
    ],
    returnType: 'number',
  },
  {
    name: 'log',
    signature: 'log(n: number): number',
    description: 'Returns the natural logarithm',
    parameters: [
      { name: 'n', type: 'number', description: 'Number' },
    ],
    returnType: 'number',
  },
  {
    name: 'exp',
    signature: 'exp(n: number): number',
    description: 'Returns e raised to the power of n',
    parameters: [
      { name: 'n', type: 'number', description: 'Exponent' },
    ],
    returnType: 'number',
  },
  {
    name: 'odd',
    signature: 'odd(n: number): boolean',
    description: 'Tests if number is odd',
    parameters: [
      { name: 'n', type: 'number', description: 'Number to test' },
    ],
    returnType: 'boolean',
  },
  {
    name: 'even',
    signature: 'even(n: number): boolean',
    description: 'Tests if number is even',
    parameters: [
      { name: 'n', type: 'number', description: 'Number to test' },
    ],
    returnType: 'boolean',
  },
];

/**
 * Get function information by name
 */
export function getBuiltInFunction(name: string): BuiltInFunction | undefined {
  return builtInFunctions.find((fn) => fn.name === name);
}

/**
 * Get all function names (for completion)
 */
export function getBuiltInFunctionNames(): string[] {
  return Array.from(new Set(builtInFunctions.map((fn) => fn.name)));
}
