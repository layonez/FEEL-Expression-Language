# FEEL Expression Language

Consistent FEEL (Friendly Enough Expression Language) tooling across IDEs with a single, reusable parser/validator core.

## Purpose

Provide fast feedback (syntax/arity errors, built-in signatures, simple completions) for standalone `.feel` files and FEEL fragments inside DMN. Keep distribution simple now (local command), enable bundling later.

## Architecture

This is a **pnpm TypeScript monorepo** with the following packages:

- **@feel/core**: Parser and validator using `lezer-feel` and `feelin`
- **@feel/lsp-server**: Language Server Protocol implementation
- **@feel/vscode-extension**: VS Code extension
- **@feel/intellij-plugin**: IntelliJ IDEA plugin

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

### Using the IntelliJ Plugin (Recommended)

1. **Build and install the plugin:**
   ```bash
   pnpm build
   cd packages/intellij-plugin
   pnpm build
   ```

2. **Install in IntelliJ:**
   - Go to **Settings** → **Plugins** → **⚙️** → **Install Plugin from Disk...**
   - Select `packages/intellij-plugin/build/distributions/intellij-feel-plugin-0.0.1.zip`
   - Restart IntelliJ IDEA

3. **Test the features:**
   - Open or create a `.feel` file (e.g., `examples/test.feel`)
   - Verify that:
     - Syntax highlighting works automatically
     - Syntax errors are highlighted with diagnostics
     - Hovering over built-in functions shows documentation (e.g., `sum`, `date`, `substring`)
     - Code completion works with `Ctrl+Space`

See [IntelliJ Plugin README](packages/intellij-plugin/README.md) for more details.

### Using Manual LSP Configuration (Alternative)

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

### LSP Server (Fully Implemented)

- ✅ **Diagnostics**: Syntax error detection from `lezer-feel` parser
- ✅ **Hover**: Documentation for 80+ FEEL built-in functions (73 unique names)
- ✅ **Completion**: Keywords and built-in functions with signatures
- ✅ **Semantic Tokens**: Syntax highlighting via LSP
- ✅ **TCP & stdio modes**: Connect via standard I/O or TCP socket

### IDE Clients

- ✅ **VS Code Extension**: Lean wrapper (~90 LOC) that spawns LSP server
- ✅ **IntelliJ Plugin**: Lean Kotlin wrapper (~400 LOC) that spawns LSP server via LSP4IJ

## Testing with VS Code

1. **Build and open extension:**
   ```bash
   pnpm build
   code packages/vscode-extension
   ```

2. **Launch Extension Development Host:**
   - Press `F5` in VS Code
   - Opens new window with extension activated

3. **Test features:**
   - Open `examples/01-basic-types.feel`
   - See syntax highlighting via semantic tokens
   - Hover over `sum`, `date`, `substring` for docs
   - Type `Ctrl+Space` for completions
   - See diagnostics on syntax errors

## Development

### Package Scripts

```bash
# Build all packages
pnpm build

# Watch mode for development
pnpm dev

# Clean build artifacts
pnpm clean

# Update FEEL built-in functions from Apache KIE spec
pnpm update-builtins
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

## Design Philosophy

This project leverages the FEEL ecosystem packages to minimize custom code:

- **Parser**: Uses `lezer-feel` directly with diagnostic extraction pattern from `feel-playground`
- **Built-ins**: Auto-generated from Apache KIE Drools spec with rich descriptions for LSP hover (not available in `feelin`)
- **Minimal Wrappers**: Thin abstractions over library APIs for LSP integration

The built-in functions are automatically generated from the official Apache KIE Drools specification.

## Updating Built-in Functions

The FEEL built-in functions are auto-generated from the official Apache KIE Drools specification:

```bash
pnpm update-builtins  # Fetches and regenerates from spec
pnpm build            # Rebuild after updating
```

The `update-builtins` script automatically:
- Fetches latest function definitions from [Apache KIE Drools](https://github.com/apache/incubator-kie-drools/blob/main/kie-dmn/kie-dmn-feel/ref-dmn-feel-builtin-functions.adoc)
- Parses 80+ FEEL built-in functions (73 unique names) from DMN 1.3 spec
- Generates TypeScript metadata with descriptions for LSP features (hover, completion)
- Validates the output compiles correctly

The generated `packages/core/src/builtins.ts` file includes clear auto-generated warnings and should not be edited manually.

## References

- [DMN 1.3 Specification](https://www.omg.org/spec/DMN/)
- [FEEL Specification](https://www.omg.org/spec/DMN/1.3/)
- [Apache KIE Drools FEEL Reference](https://github.com/apache/incubator-kie-drools/blob/main/kie-dmn/kie-dmn-feel/ref-dmn-feel-builtin-functions.adoc)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)
- [lezer-feel](https://www.npmjs.com/package/lezer-feel)
- [feelin](https://www.npmjs.com/package/feelin)

## License

ISC