# FEEL Expression Language

Consistent FEEL (Friendly Enough Expression Language) tooling across IDEs with a single, reusable parser/validator core.

## Purpose

Provide fast feedback (syntax/arity errors, built-in signatures, simple completions) for standalone `.feel` files and FEEL fragments inside DMN. Keep distribution simple now (local command), enable bundling later.

## Architecture

This is a **pnpm TypeScript monorepo** with the following packages:

- **@feel/core**: Parser and validator using `lezer-feel` and `feelin`
- **@feel/lsp-server**: Language Server Protocol implementation
- **@feel/vscode-extension**: VS Code client (placeholder)
- **@feel/intellij-plugin**: IntelliJ IDEA plugin (placeholder)

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Running the LSP Server

The MVP provides a runnable LSP server that can be tested locally with IntelliJ IDEA or other LSP-compatible editors.

#### Start server in stdio mode (default):
```bash
pnpm lsp:start
# or
./packages/lsp-server/dist/cli.js --stdio
```

#### Start server in TCP mode (for IntelliJ):
```bash
pnpm lsp:start:tcp
# or
./packages/lsp-server/dist/cli.js --tcp :7345
```

The server will listen on `localhost:7345` by default.

## Testing with IntelliJ IDEA

1. **Start the LSP server** in TCP mode:
   ```bash
   pnpm lsp:start:tcp
   ```

2. **Configure IntelliJ IDEA**:
   - Go to **Settings** → **Languages & Frameworks** → **Language Server Protocol**
   - Click **+** to add a new server configuration
   - Configure as follows:
     - **Extension/File name pattern**: `*.feel`
     - **Path**: Leave empty (server already running)
     - **Arguments**: `tcp://localhost:7345`
   - Click **OK** and **Apply**

3. **Test the features**:
   - Open or create a `.feel` file (e.g., `examples/test.feel`)
   - Verify that:
     - Syntax errors are highlighted (red squiggles)
     - Hovering over built-in functions shows documentation (e.g., `sum`, `date`, `substring`)

## MVP Features

Currently implemented:

- ✅ **Diagnostics**: Syntax error detection from `lezer-feel` parser
- ✅ **Hover**: Documentation for FEEL built-in functions
- ✅ **TCP & stdio modes**: Connect via standard I/O or TCP socket

Coming soon (not yet implemented):

- ⏳ Code completion for keywords and built-in functions
- ⏳ Semantic tokens for enhanced syntax highlighting
- ⏳ VS Code extension
- ⏳ IntelliJ plugin with bundled server

## Development

### Package Scripts

```bash
# Build all packages
pnpm build

# Watch mode for development
pnpm dev

# Clean build artifacts
pnpm clean
```

### Package Structure

```
packages/
├── core/              # Parser and validator (@feel/core)
│   ├── src/
│   │   ├── types.ts      # Type definitions
│   │   ├── parser.ts     # Parser wrapper
│   │   ├── builtins.ts   # Built-in function metadata
│   │   └── index.ts
│   └── package.json
├── lsp-server/        # LSP server (@feel/lsp-server)
│   ├── src/
│   │   ├── server.ts     # Server implementation
│   │   ├── cli.ts        # CLI entry point
│   │   └── index.ts
│   └── package.json
├── vscode-extension/  # VS Code client (placeholder)
└── intellij-plugin/   # IntelliJ plugin (placeholder)
```

## Technologies

- **Parser**: `lezer-feel@1.9.0` (Lezer grammar for FEEL)
- **Interpreter**: `feelin@4.3.0+` (for built-in function metadata)
- **LSP**: `vscode-languageserver@9.0.1`
- **Build**: `tsup`, `pnpm workspaces`
- **Language**: TypeScript, ES2022, ESM

## References

- [DMN 1.3 Specification](https://www.omg.org/spec/DMN/)
- [FEEL Specification](https://www.omg.org/spec/DMN/1.3/)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)
- [lezer-feel](https://www.npmjs.com/package/lezer-feel)
- [feelin](https://www.npmjs.com/package/feelin)

## License

ISC