import { BuiltInFunction } from './types.js';

/**
 * Metadata for FEEL built-in functions
 * Based on DMN 1.3 specification and Apache KIE Drools implementation
 *
 * Note: While the `feelin` library contains the actual built-in function
 * implementations, it does not export metadata with descriptions suitable
 * for LSP hover information. This file provides rich documentation for
 * each built-in function to enhance the developer experience.
 *
 * References:
 * - https://github.com/nikku/feelin/blob/main/src/builtins.ts
 * - https://github.com/apache/incubator-kie-drools/blob/main/kie-dmn/kie-dmn-feel/ref-dmn-feel-builtin-functions.adoc
 */
export const builtInFunctions: BuiltInFunction[] = [

  // ========================================
  // Conversion functions
  // ========================================

  {
    name: 'date',
    signature: 'date(from: date and time): any',
    description: 'Converts `from` to a `date` value and sets time components to null.',
    parameters: [
      {
        name: 'from',
        type: 'date and time',
        description: 'from parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'date',
    signature: 'date(year: number, month: number, day: number): any',
    description: 'Produces a `date` from the specified year, month, and day values.',
    parameters: [
      {
        name: 'year',
        type: 'number',
        description: 'year parameter',
      },
      {
        name: 'month',
        type: 'number',
        description: 'month parameter',
      },
      {
        name: 'day',
        type: 'number',
        description: 'day parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'date and time',
    signature: 'date and time(date: date or date and time, time: time): any',
    description: 'Produces a `date and time` from the specified date and ignores any time components and the specified time.',
    parameters: [
      {
        name: 'date',
        type: 'date or date and time',
        description: 'date parameter',
      },
      {
        name: 'time',
        type: 'time',
        description: 'time parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'date and time',
    signature: 'date and time(from: string): any',
    description: 'Produces a `date and time` from the specified string.',
    parameters: [
      {
        name: 'from',
        type: 'string',
        description: 'date time string',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'time',
    signature: 'time(from: string): any',
    description: 'Produces a `time` from the specified string.',
    parameters: [
      {
        name: 'from',
        type: 'string',
        description: 'time string',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'time',
    signature: 'time(from: time or date and time): any',
    description: 'Produces a `time` from the specified parameter and ignores any date components.',
    parameters: [
      {
        name: 'from',
        type: 'time or date and time',
        description: 'from parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'time',
    signature: 'time(hour?: number, minute?: number, second?: number, offset (Optional)?: days and time duration or null): any',
    description: 'Produces a `time` from the specified hour, minute, and second component values.',
    parameters: [
      {
        name: 'hour',
        type: 'number',
        optional: true,
        description: 'hour parameter',
      },
      {
        name: 'minute',
        type: 'number',
        optional: true,
        description: 'minute parameter',
      },
      {
        name: 'second',
        type: 'number',
        optional: true,
        description: 'second parameter',
      },
      {
        name: 'offset (Optional)',
        type: 'days and time duration or null',
        optional: true,
        description: 'offset (Optional) parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'number',
    signature: 'number(from: string representing a valid number, grouping separator: Space ( ), comma (,), period (.), or null, decimal separator: Same types as grouping separator, but the values cannot match): any',
    description: 'Converts `from` to a `number` using the specified separators.',
    parameters: [
      {
        name: 'from',
        type: 'string representing a valid number',
        description: 'from parameter',
      },
      {
        name: 'grouping separator',
        type: 'Space ( ), comma (,), period (.), or null',
        description: 'grouping separator parameter',
      },
      {
        name: 'decimal separator',
        type: 'Same types as grouping separator, but the values cannot match',
        description: 'decimal separator parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'string',
    signature: 'string(from: Non-null value): any',
    description: 'Provides a string representation of the specified parameter.',
    parameters: [
      {
        name: 'from',
        type: 'Non-null value',
        description: 'from parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'duration',
    signature: 'duration(from: string): any',
    description: 'Converts `from` to a `days and time duration` value or `years and months duration` value.',
    parameters: [
      {
        name: 'from',
        type: 'string',
        description: 'duration string',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'years and months duration',
    signature: 'years and months duration(from: date or date and time, to: date or date and time): any',
    description: 'Calculates the `years and months duration` between the two specified parameters.',
    parameters: [
      {
        name: 'from',
        type: 'date or date and time',
        description: 'from parameter',
      },
      {
        name: 'to',
        type: 'date or date and time',
        description: 'to parameter',
      }
    ],
    returnType: 'any',
  },

  // ========================================
  // String functions
  // ========================================

  {
    name: 'string length',
    signature: 'string length(string: string): any',
    description: 'Calculates the length of the specified string.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'upper case',
    signature: 'upper case(string: string): any',
    description: 'Produces an uppercase version of the specified string.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'lower case',
    signature: 'lower case(string: string): any',
    description: 'Produces a lowercase version of the specified string.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'substring before',
    signature: 'substring before(string: string, match: string): any',
    description: 'Calculates the substring before the match.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'match',
        type: 'string',
        description: 'match parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'substring after',
    signature: 'substring after(string: string, match: string): any',
    description: 'Calculates the substring after the match.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'match',
        type: 'string',
        description: 'match parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'replace',
    signature: 'replace(input?: string, pattern?: string, replacement?: string, flags (Optional)?: string): any',
    description: 'Calculates the regular expression replacement.',
    parameters: [
      {
        name: 'input',
        type: 'string',
        optional: true,
        description: 'input parameter',
      },
      {
        name: 'pattern',
        type: 'string',
        optional: true,
        description: 'pattern parameter',
      },
      {
        name: 'replacement',
        type: 'string',
        optional: true,
        description: 'replacement parameter',
      },
      {
        name: 'flags (Optional)',
        type: 'string',
        optional: true,
        description: 'flags (Optional) parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'contains',
    signature: 'contains(string: string, match: string): true',
    description: 'Returns `true` if the string contains the match.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'match',
        type: 'string',
        description: 'match parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'starts with',
    signature: 'starts with(string: string, match: string): true',
    description: 'Returns `true` if the string starts with the match',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'match',
        type: 'string',
        description: 'match parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'ends with',
    signature: 'ends with(string: string, match: string): true',
    description: 'Returns `true` if the string ends with the match.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'match',
        type: 'string',
        description: 'match parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'matches',
    signature: 'matches(input?: string, pattern?: string, flags (Optional)?: string): true',
    description: 'Returns `true` if the input matches the regular expression.',
    parameters: [
      {
        name: 'input',
        type: 'string',
        optional: true,
        description: 'input parameter',
      },
      {
        name: 'pattern',
        type: 'string',
        optional: true,
        description: 'pattern parameter',
      },
      {
        name: 'flags (Optional)',
        type: 'string',
        optional: true,
        description: 'flags (Optional) parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'split',
    signature: 'split(string: string, delimiter: string for a regular expression pattern): any',
    description: 'Returns a list of the original string and splits it at the delimiter regular expression pattern.',
    parameters: [
      {
        name: 'string',
        type: 'string',
        description: 'string parameter',
      },
      {
        name: 'delimiter',
        type: 'string for a regular expression pattern',
        description: 'delimiter parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'string join',
    signature: 'string join(list: list of string, delimiter: string): any',
    description: 'Returns a string which is composed by joining all the string elements from the list parameter, separated by the delimiter. The `delimiter` can be an empty string. Null elements in the list parameter are ignored. If `list` is empty, the result is the empty string. If `delimiter` is null, the string elements are joined without a separator.',
    parameters: [
      {
        name: 'list',
        type: 'list of string',
        description: 'list parameter',
      },
      {
        name: 'delimiter',
        type: 'string',
        description: 'delimiter parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'string join',
    signature: 'string join(list: list of string): any',
    description: 'Returns a string which is composed by joining all the string elements from the list parameter. Null elements in the `list` parameter are ignored. If `list` is empty, the result is the empty string.',
    parameters: [
      {
        name: 'list',
        type: 'list of string',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },

  // ========================================
  // List functions
  // ========================================

  {
    name: 'count',
    signature: 'count(list: list): any',
    description: 'Counts the elements in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'min',
    signature: 'min(list: list): any',
    description: 'Returns the minimum comparable element in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'max',
    signature: 'max(list: list): any',
    description: 'Returns the maximum comparable element in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'sum',
    signature: 'sum(list: list of number elements): any',
    description: 'Returns the sum of the numbers in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'mean',
    signature: 'mean(list: list of number elements): any',
    description: 'Calculates the average (arithmetic mean) of the elements in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'all',
    signature: 'all(list: list of boolean elements): true',
    description: 'Returns `true` if all elements in the list are true.',
    parameters: [
      {
        name: 'list',
        type: 'list of boolean elements',
        description: 'list parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'any',
    signature: 'any(list: list of boolean elements): true',
    description: 'Returns `true` if any element in the list is true.',
    parameters: [
      {
        name: 'list',
        type: 'list of boolean elements',
        description: 'list parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'sublist',
    signature: 'sublist(list?: list, start position?: number, length (Optional)?: number): any',
    description: 'Returns the sublist from the start position, limited to the length elements.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        optional: true,
        description: 'list parameter',
      },
      {
        name: 'start position',
        type: 'number',
        optional: true,
        description: 'start position parameter',
      },
      {
        name: 'length (Optional)',
        type: 'number',
        optional: true,
        description: 'length (Optional) parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'append',
    signature: 'append(list: list, item: Any type): any',
    description: 'Creates a list that is appended to the item or items.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      },
      {
        name: 'item',
        type: 'Any type',
        description: 'item parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'concatenate',
    signature: 'concatenate(list: list): any',
    description: 'Creates a list that is the result of the concatenated lists.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'insert before',
    signature: 'insert before(list: list, position: number, newItem: Any type): any',
    description: 'Creates a list with the `newItem` inserted at the specified position.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      },
      {
        name: 'position',
        type: 'number',
        description: 'position parameter',
      },
      {
        name: 'newItem',
        type: 'Any type',
        description: 'newItem parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'remove',
    signature: 'remove(list: list, position: number): any',
    description: 'Creates a list with the removed element excluded from the specified position.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      },
      {
        name: 'position',
        type: 'number',
        description: 'position parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'reverse',
    signature: 'reverse(list: list): any',
    description: 'Returns a reversed list.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'index of',
    signature: 'index of(list: list, match: Any type): any',
    description: 'Returns indexes matching the element.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      },
      {
        name: 'match',
        type: 'Any type',
        description: 'match parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'union',
    signature: 'union(list: list): any',
    description: 'Returns a list of all the elements from multiple lists and excludes duplicates.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'distinct values',
    signature: 'distinct values(list: list): any',
    description: 'Returns a list of elements from a single list and excludes duplicates.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'flatten',
    signature: 'flatten(list: list): any',
    description: 'Returns a flattened list.',
    parameters: [
      {
        name: 'list',
        type: 'list',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'product',
    signature: 'product(list: list of number elements): any',
    description: 'Returns the product of the numbers in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'median',
    signature: 'median(list: list of number elements): any',
    description: 'Returns the median of the numbers in the list. If the number of elements is odd, the result is the middle element. If the number of elements is even, the result is the average of the two middle elements.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'stddev',
    signature: 'stddev(list: list of number elements): any',
    description: 'Returns the standard deviation of the numbers in the list.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'mode',
    signature: 'mode(list: list of number elements): any',
    description: 'Returns the mode of the numbers in the list. If multiple elements are returned, the numbers are sorted in ascending order.',
    parameters: [
      {
        name: 'list',
        type: 'list of number elements',
        description: 'list parameter',
      }
    ],
    returnType: 'any',
  },

  // ========================================
  // Numeric functions
  // ========================================

  {
    name: 'floor',
    signature: 'floor(n: number): n',
    description: 'Returns `n` with given scale and rounding mode _flooring_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'ceiling',
    signature: 'ceiling(n: number): n',
    description: 'Returns `n` with given scale and rounding mode _ceiling_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'round up',
    signature: 'round up(n: number, scale: number): n',
    description: 'Returns `n` with given scale and rounding mode _round up_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      },
      {
        name: 'scale',
        type: 'number',
        description: 'scale parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'round down',
    signature: 'round down(n: number, scale: number): n',
    description: 'Returns `n` with given scale and rounding mode _round down_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      },
      {
        name: 'scale',
        type: 'number',
        description: 'scale parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'round half up',
    signature: 'round half up(n: number, scale: number): n',
    description: 'Returns `n` with given scale and rounding mode _round half up_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      },
      {
        name: 'scale',
        type: 'number',
        description: 'scale parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'round half down',
    signature: 'round half down(n: number, scale: number): n',
    description: 'Returns `n` with given scale and rounding mode _round half down_. If at least one of `n` or `scale` is null, the result is null.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      },
      {
        name: 'scale',
        type: 'number',
        description: 'scale parameter',
      }
    ],
    returnType: 'n',
  },
  {
    name: 'abs',
    signature: 'abs(n: number, days and time duration, or years and months duration): any',
    description: 'Returns the absolute value.',
    parameters: [
      {
        name: 'n',
        type: 'number, days and time duration, or years and months duration',
        description: 'n parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'modulo',
    signature: 'modulo(dividend: number, divisor: number): any',
    description: 'Returns the remainder of the division of the dividend by the divisor. If either the dividend or divisor is negative, the result is of the same sign as the divisor. NOTE: This function is also expressed as `modulo(dividend, divisor) = dividend - divisor*floor(dividen d/divisor)`.',
    parameters: [
      {
        name: 'dividend',
        type: 'number',
        description: 'dividend parameter',
      },
      {
        name: 'divisor',
        type: 'number',
        description: 'divisor parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'sqrt',
    signature: 'sqrt(n: number): any',
    description: 'Returns the square root of the specified number.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'log',
    signature: 'log(n: number): any',
    description: 'Returns the logarithm of the specified number.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'exp',
    signature: 'exp(n: number): any',
    description: 'Returns Euler’s number `e` raised to the power of the specified number.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'odd',
    signature: 'odd(n: number): true',
    description: 'Returns `true` if the specified number is odd.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'true',
  },
  {
    name: 'even',
    signature: 'even(n: number): true',
    description: 'Returns `true` if the specified number is even.',
    parameters: [
      {
        name: 'n',
        type: 'number',
        description: 'n parameter',
      }
    ],
    returnType: 'true',
  },

  // ========================================
  // Range functions
  // ========================================

  {
    name: 'after',
    signature: 'after(): true',
    description: 'Returns `true` when an element `A` is after an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `after( point1 point2 )` b. `after( point range )` c. `after( range, point )` d. `after( range1 range2 )` .Requirements for evaluating to `true` a. `point1 > point2` b. `point > range.end or ( point = range.end and not(range.end included) )` c. `range.start > point or ( range.start = point and not(range.start included) )` d. `range1.start > range2.end or (( not(range1.start included) or not(range2.end included) ) and range1.start = range2.end )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'meets',
    signature: 'meets(): true',
    description: 'Returns `true` when an element `A` meets an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `meets( range1, range2 )` .Requirements for evaluating to `true` a. `range1.end included and range2.start included and range1.end = range2.start`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'met by',
    signature: 'met by(): true',
    description: 'Returns `true` when an element `A` is met by an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `met by( range1, range2 )` .Requirements for evaluating to `true` a. `range1.start included and range2.end included and range1.start = range2.end`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'overlaps',
    signature: 'overlaps(): true',
    description: 'Returns `true` when an element `A` overlaps an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `overlaps( range1, range2 )` .Requirements for evaluating to `true` a. `( range1.end > range2.start or (range1.end = range2.start and range1.end included and range2.end included) ) and ( range1.start < range2.end or (range1.start = range2.end and range1.start included and range2.end included) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'overlaps before',
    signature: 'overlaps before(): true',
    description: 'Returns `true` when an element `A` overlaps before an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `overlaps before( range1 range2 )` .Requirements for evaluating to `true` a. `( range1.start < range2.start or (range1.start = range2.start and range1.start included and not(range2.start included)) ) and ( range1.end > range2.start or (range1.end = range2.start and range1.end included and range2.start included) ) and ( range1.end < range2.end or (range1.end = range2.end and (not(range1.end included) or range2.end included )) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'overlaps after',
    signature: 'overlaps after(): true',
    description: 'Returns `true` when an element `A` overlaps after an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `overlaps after( range1 range2 )` .Requirements for evaluating to `true` a. `( range2.start < range1.start or (range2.start = range1.start and range2.start included and not( range1.start included)) ) and ( range2.end > range1.start or (range2.end = range1.start and range2.end included and range1.start included) ) and ( range2.end < range1.end or (range2.end = range1.end and (not(range2.end included) or range1.end included)) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'finishes',
    signature: 'finishes(): true',
    description: 'Returns `true` when an element `A` finishes an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `finishes( point, range )` b. `finishes( range1, range2 )` .Requirements for evaluating to `true` a. `range.end included and range.end = point` b. `range1.end included = range2.end included and range1.end = range2.end and ( range1.start > range2.start or (range1.start = range2.start and (not(range1.start included) or range2.start included)) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'finished by',
    signature: 'finished by(): true',
    description: 'Returns `true` when an element `A` is finished by an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `finished by( range, point )` b. `finished by( range1 range2 )` .Requirements for evaluating to `true` a. `range.end included and range.end = point` b. `range1.end included = range2.end included and range1.end = range2.end and ( range1.start < range2.start or (range1.start = range2.start and (range1.start included or not(range2.start included))) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'includes',
    signature: 'includes(): true',
    description: 'Returns `true` when an element `A` includes an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `includes( range, point )` b. `includes( range1, range2 )` .Requirements for evaluating to `true` a. `(range.start < point and range.end > point) or (range.start = point and range.start included) or (range.end = point and range.end included)` b. `( range1.start < range2.start or (range1.start = range2.start and (range1.start included or not(range2.start included))) ) and ( range1.end > range2.end or (range1.end = range2.end and (range1.end included or not(range2.end included))) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'during',
    signature: 'during(): true',
    description: 'Returns `true` when an element `A` is during an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `during( point, range )` b. `during( range1 range2 )` .Requirements for evaluating to `true` a. `(range.start < point and range.end > point) or (range.start = point and range.start included) or (range.end = point and range.end included)` b. `( range2.start < range1.start or (range2.start = range1.start and (range2.start included or not(range1.start included))) ) and ( range2.end > range1.end or (range2.end = range1.end and (range2.end included or not(range1.end included))) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'starts',
    signature: 'starts(): true',
    description: 'Returns `true` when an element `A` starts an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `starts( point, range )` b. `starts( range1, range2 )` .Requirements for evaluating to `true` a. `range.start = point and range.start included` b. `range1.start = range2.start and range1.start included = range2.start included and ( range1.end < range2.end or (range1.end = range2.end and (not(range1.end included) or range2.end included)) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'started by',
    signature: 'started by(): true',
    description: 'Returns `true` when an element `A` is started by an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `started by( range, point )` b. `started by( range1, range2 )` .Requirements for evaluating to `true` a. `range.start = point and range.start included` b. `range1.start = range2.start and range1.start included = range2.start included and ( range2.end < range1.end or (range2.end = range1.end and (not(range2.end included) or range1.end included)) )`',
    parameters: [

    ],
    returnType: 'true',
  },
  {
    name: 'coincides',
    signature: 'coincides(): true',
    description: 'Returns `true` when an element `A` coincides with an element `B` and when the relevant requirements for evaluating to `true` are also met. .Signatures a. `coincides( point1, point2 )` b. `coincides( range1, range2 )` .Requirements for evaluating to `true` a. `point1 = point2` b. `range1.start = range2.start and range1.start included = range2.start included and range1.end = range2.end and range1.end included = range2.end included`',
    parameters: [

    ],
    returnType: 'true',
  },

  // ========================================
  // Temporal functions
  // ========================================

  {
    name: 'day of week',
    signature: 'day of week(date: date or date and time): any',
    description: 'Returns the Gregorian day of the week: `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`, `"Saturday"`, or `"Sunday"`.',
    parameters: [
      {
        name: 'date',
        type: 'date or date and time',
        description: 'date parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'month of year',
    signature: 'month of year(date: date or date and time): any',
    description: 'Returns the Gregorian month of the year: `"January"`, `"February"`, `"March"`, `"April"`, `"May"`, `"June"`, `"July"`, `"August"`, `"September"`, `"October"`, `"November"`, or `"December"`.',
    parameters: [
      {
        name: 'date',
        type: 'date or date and time',
        description: 'date parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'month of year',
    signature: 'month of year(date: date or date and time): any',
    description: 'Returns the Gregorian week of the year as defined by ISO 8601.',
    parameters: [
      {
        name: 'date',
        type: 'date or date and time',
        description: 'date parameter',
      }
    ],
    returnType: 'any',
  },

  // ========================================
  // Context functions
  // ========================================

  {
    name: 'get entries',
    signature: 'get entries(m: context): any',
    description: 'Returns a list of key-value pairs for the specified context.',
    parameters: [
      {
        name: 'm',
        type: 'context',
        description: 'm parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'context',
    signature: 'context(entries: list of context , each item SHALL have two entries having keys named "key" and "value" respectively): any',
    description: 'Returns a new context that includes all specified entries. If a context item contains additional entries beyond the required "key" and "value" entries, the additional entries are ignored. If a context item is missing the required "key" and "value" entries, the final result is null. See also: get entries() built-in function.',
    parameters: [
      {
        name: 'entries',
        type: 'list of context , each item SHALL have two entries having keys named "key" and "value" respectively',
        description: 'entries parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'context put',
    signature: 'context put(context: context, key: string, value: Any type): any',
    description: 'Returns a new context that includes the new entry, or overrides the existing value if an entry for the same key already exists in the supplied context parameter. A new entry is added as the last entry of the new context. If overriding an existing entry, the order of the keys maintains the same order as in the original context.',
    parameters: [
      {
        name: 'context',
        type: 'context',
        description: 'context parameter',
      },
      {
        name: 'key',
        type: 'string',
        description: 'key parameter',
      },
      {
        name: 'value',
        type: 'Any type',
        description: 'value parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'context put',
    signature: 'context put(context: context, keys: list of string, value: Any type): any',
    description: 'Returns the composite of nested invocations to `context put()` for each item in `keys` hierarchy in context. If `keys` is a list of 1 element, this is equivalent to `context put(context, key\', value)`, where `key\'` is the only element in the list keys. If `keys` is a list of 2 or more elements, this is equivalent of calling `context put(context, key\', value\')`, with: + `key\'` is the head element in the list keys, + `value\'` is the result of invocation of `context put(context\', keys\', value)`, where: + `context\'` is the result of `context.key\'`, + `keys\'` is the remainder of the list keys without the head element `key\'`. If `keys` is an empty list or null, the result is null.',
    parameters: [
      {
        name: 'context',
        type: 'context',
        description: 'context parameter',
      },
      {
        name: 'keys',
        type: 'list of string',
        description: 'keys parameter',
      },
      {
        name: 'value',
        type: 'Any type',
        description: 'value parameter',
      }
    ],
    returnType: 'any',
  },
  {
    name: 'context merge',
    signature: 'context merge(contexts: list of context): any',
    description: 'Returns a new context that includes all entries from the given contexts; if some of the keys are equal, the entries are overridden. The entries are overridden in the same order as specified by the supplied parameter, with new entries added as the last entry in the new context.',
    parameters: [
      {
        name: 'contexts',
        type: 'list of context',
        description: 'contexts parameter',
      }
    ],
    returnType: 'any',
  },

  // ========================================
  // Miscellaneous functions
  // ========================================

  {
    name: 'today',
    signature: 'today(): any',
    description: 'Returns the current `date`.',
    parameters: [

    ],
    returnType: 'any',
  }
];

/**
 * Get function information by name
 */
export function getBuiltInFunction(name: string): BuiltInFunction | undefined {
  return builtInFunctions.find((fn) => fn.name === name);
}

/**
 * Get all overloads for a function name
 */
export function getBuiltInFunctionOverloads(name: string): BuiltInFunction[] {
  return builtInFunctions.filter((fn) => fn.name === name);
}

/**
 * Get all function names (for completion)
 */
export function getBuiltInFunctionNames(): string[] {
  return Array.from(new Set(builtInFunctions.map((fn) => fn.name)));
}
