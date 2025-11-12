# Custom FEEL Functions

This document describes the custom FEEL functions that extend the standard DMN 1.3 built-in functions.

## Overview

The FEEL LSP supports **90 total functions**:
- **80 standard built-in functions** from the DMN 1.3 specification (auto-generated from Apache KIE Drools)
- **10 custom functions** for extended functionality (defined in `packages/core/src/customs.ts`)

## Architecture

The integration maintains separation between standard and custom functions:

```
packages/core/src/
├── builtins.ts      # Auto-generated DMN 1.3 built-ins (DO NOT EDIT)
├── customs.ts       # Custom function definitions (EDITABLE)
└── index.ts         # Exports both sets
```

### How It Works

1. **`builtins.ts`** exports:
   - `builtInFunctions` - Standard DMN functions (auto-generated)
   - `customFunctions` - Imported from customs.ts
   - `allFunctions` - Merged array of both
   - Helper functions (`getBuiltInFunction`, etc.) search `allFunctions`

2. **LSP Server** automatically includes all functions via existing API:
   - `getBuiltInFunction()` - Returns any function (built-in or custom)
   - `getBuiltInFunctionNames()` - Returns all function names
   - No LSP code changes needed!

3. **Maintenance**:
   - Update standard functions: Run `pnpm update-builtins`
   - Add custom functions: Edit `packages/core/src/customs.ts`
   - Both remain separate and maintainable

## Custom Functions Reference

### Network / HTTP

#### `httpCall`
Executes an HTTP request and returns a response context.

```feel
httpCall(
  method: string,           // GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
  endpoint: string,         // Absolute HTTP(S) URL or spm:/// path
  headers: context,         // Request headers (single value per key)
  body?: any,              // Request body (optional)
  config?: context         // Extra execution options (optional)
): context                 // Returns {statusCode, headers, body}
```

**Example:**
```feel
httpCall(
  "GET",
  "https://api.example.com/users",
  { Authorization: "Bearer token123" }
)
```

---

### JSON Parsing

#### `parseJson` (3 overloads)

**1. Basic parsing:**
```feel
parseJson(json: string): any
```
Parses a JSON string into a FEEL value.

**Example:**
```feel
parseJson('{"name": "John", "age": 30}')
// Returns: {name: "John", age: 30}
```

**2. Path extraction:**
```feel
parseJson(json: string, path: string): any
```
Parses JSON and extracts a value at a JSON Pointer (RFC 6901) path.

**Example:**
```feel
parseJson('{"user": {"name": "Alice"}}', "/user/name")
// Returns: "Alice"
```

**3. Selective parsing:**
```feel
parseJson(json: string, keep: context<string, string>): context
```
Parses JSON and builds a new context from selected JSON Pointer paths.

**Example:**
```feel
parseJson(
  '{"id": 1, "name": "Bob", "email": "bob@example.com"}',
  { userId: "/id", userName: "/name" }
)
// Returns: {userId: 1, userName: "Bob"}
```

---

### Validation & Assertions

#### `validate`
Validates a context with assertions and returns the value if all pass.

```feel
validate(validation: context): any
```

The validation context must contain:
- `value` (any) - The value to validate and return
- `retry` (boolean) - Whether validation errors should be retryable
- `assert` (context<string, boolean>) - Map of error messages to predicates

**Example:**
```feel
validate({
  value: 42,
  retry: false,
  assert: {
    "Value must be positive": value > 0,
    "Value must be less than 100": value < 100
  }
})
// Returns: 42 (if all assertions pass)
```

---

#### `assert` (2 overloads)

**1. Single assertion:**
```feel
assert(message: string, predicate: boolean): boolean
```
Throws an error with the message if predicate is false; returns true otherwise.

**Example:**
```feel
assert("Number must be even", 10 mod 2 = 0)
// Returns: true
```

**2. Multiple assertions:**
```feel
assert(assertions: context<string, boolean>): boolean
```
Validates multiple predicates sequentially; throws on first failure.

**Example:**
```feel
assert({
  "Name is not empty": string length(name) > 0,
  "Age is valid": age >= 18
})
```

---

#### `retry`
Throws a retryable error (never returns normally).

```feel
retry(message: string): boolean
```

**Example:**
```feel
if statusCode >= 500 then
  retry("Server error - please retry")
else
  response
```

---

#### `fail`
Throws a non-retryable error (never returns normally).

```feel
fail(message: string): boolean
```

**Example:**
```feel
if not authenticated then
  fail("Authentication failed - do not retry")
else
  processRequest()
```

---

### Encoding Utilities

#### `urlEncode`
URL-encodes a string using UTF-8.

```feel
urlEncode(value: string): string
```

**Example:**
```feel
urlEncode("hello world & special chars")
// Returns: "hello%20world%20%26%20special%20chars"
```

---

## Adding New Custom Functions

To add new custom functions:

1. Edit `packages/core/src/customs.ts`
2. Add your function definition to the `customFunctions` array:
   ```typescript
   {
     name: 'myFunction',
     signature: 'myFunction(param1: type1, param2: type2): returnType',
     description: 'What the function does',
     parameters: [
       { name: 'param1', type: 'type1', description: 'Parameter description' },
       { name: 'param2', type: 'type2', description: 'Parameter description', optional: true }
     ],
     returnType: 'returnType'
   }
   ```
3. Rebuild: `pnpm build`
4. The function will automatically appear in LSP hover, completion, and documentation

---

## Testing Custom Functions

Use the example file to test custom functions:
```bash
# Open in your IDE with the FEEL LSP extension
examples/02-custom-functions.feel
```

Test that:
- Hover over custom function names shows documentation
- Auto-completion suggests custom functions
- Syntax highlighting works correctly

---

## Function Count Summary

| Category | Count |
|----------|-------|
| Standard DMN 1.3 Built-ins | 80 |
| Custom Extensions | 10 |
| **Total** | **90** |

Unique function names: **80** (some functions have multiple overloads)

---

## References

- [DMN 1.3 Specification](https://www.omg.org/spec/DMN/1.3/)
- [Apache KIE Drools FEEL Reference](https://github.com/apache/incubator-kie-drools/blob/main/kie-dmn/kie-dmn-feel/ref-dmn-feel-builtin-functions.adoc)
- [JSON Pointer RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901)
