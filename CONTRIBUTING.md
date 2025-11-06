# Contributing Guide

## Development Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- IntelliJ IDEA (for testing) or VS Code

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/layonez/FEEL-Expression-Language.git
cd FEEL-Expression-Language

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Project Structure

```
FEEL-Expression-Language/
├── packages/
│   ├── core/              # @feel/core - Parser and validator
│   ├── lsp-server/        # @feel/lsp-server - LSP server
│   ├── vscode-extension/  # @feel/vscode-extension (placeholder)
│   └── intellij-plugin/   # @feel/intellij-plugin (placeholder)
├── examples/              # Example FEEL files for testing
├── motivation/            # Reference implementations
└── README.md
```

## Development Workflow

### Making Changes

1. **Core Package** (`packages/core/`):
   - Modify parser logic in `src/parser.ts`
   - Add built-in functions in `src/builtins.ts`
   - Update types in `src/types.ts`

2. **LSP Server** (`packages/lsp-server/`):
   - Update server capabilities in `src/server.ts`
   - Modify CLI logic in `src/cli.ts`

3. **Build**:
   ```bash
   # Build all packages
   pnpm build

   # Or build in watch mode
   pnpm dev
   ```

### Testing Changes

1. **Start the LSP server**:
   ```bash
   pnpm lsp:start:tcp
   ```

2. **Configure IntelliJ IDEA**:
   - Settings → Languages & Frameworks → Language Server Protocol
   - Add server: `tcp://localhost:7345` for `*.feel` files

3. **Test with example files**:
   - Open `examples/test.feel`
   - Verify diagnostics and hover work correctly

### Code Style

- Use Prettier for formatting: `pnpm prettier --write .`
- Use ESLint for linting: `pnpm eslint .`
- Follow TypeScript strict mode
- Use ESM imports with `.js` extensions

## Adding Features

### Adding a New Built-in Function

1. Add function metadata to `packages/core/src/builtins.ts`:
   ```typescript
   {
     name: 'my function',
     signature: 'my function(param: type): returnType',
     description: 'Description of what it does',
     parameters: [/* ... */],
     returnType: 'type',
   }
   ```

2. Rebuild: `pnpm build`

3. Test hover over the function name in a `.feel` file

### Adding a New LSP Capability

1. Update `packages/lsp-server/src/server.ts`
2. Add capability in `onInitialize` handler
3. Implement the handler (e.g., `connection.onCompletion`)
4. Rebuild and test

## Running Tests

Tests are not yet implemented. When adding tests:

```bash
# Will be available in future
pnpm test
```

## Building for Production

```bash
# Clean build
pnpm clean
pnpm build

# The server binary will be at:
# packages/lsp-server/dist/cli.js
```

## Troubleshooting

### Build Errors

- Ensure Node.js >= 20 and pnpm >= 9
- Try `pnpm clean && pnpm install && pnpm build`

### LSP Server Not Connecting

- Check server is running: `pnpm lsp:start:tcp`
- Verify port 7345 is not in use: `lsof -i :7345`
- Check IntelliJ LSP settings for correct configuration

### Parser Issues

- The parser uses `lezer-feel@1.9.0`
- Reference grammar: `motivation/lezer-feel-main/src/feel.grammar`
- For parser bugs, check upstream repository

## Release Process

(To be defined when ready for releases)

1. Update versions in all `package.json` files
2. Update CHANGELOG.md
3. Build and test
4. Tag and publish

## Resources

- [REQS.md](./REQS.md) - MVP requirements and architecture
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)
- [lezer-feel](https://github.com/nikku/lezer-feel)
- [feelin](https://github.com/nikku/feelin)
