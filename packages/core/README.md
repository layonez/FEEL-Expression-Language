# @feel/core

Core FEEL (Friendly Enough Expression Language) parser and validator.

## Features

- Parse FEEL expressions using `lezer-feel`
- Extract syntax diagnostics
- Built-in function metadata for hover/completion
- Position/offset utilities

## Usage

```typescript
import { parse, builtInFunctions } from '@feel/core';

// Parse FEEL expression
const result = parse('sum([1, 2, 3])');
console.log(result.diagnostics); // syntax errors

// Get built-in function info
console.log(builtInFunctions);
```

## API

### `parse(input: string): ParseResult`

Parses a FEEL expression and returns the parse tree with diagnostics.

### `builtInFunctions: BuiltInFunction[]`

Array of all FEEL built-in functions with signatures and documentation.

### `getBuiltInFunction(name: string): BuiltInFunction | undefined`

Get information about a specific built-in function.

### `getBuiltInFunctionNames(): string[]`

Get a list of all built-in function names.
