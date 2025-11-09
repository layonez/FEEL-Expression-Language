# @feel/lsp-server

Language Server Protocol (LSP) server for FEEL (Friendly Enough Expression Language).

Compiled into **standalone executables** for macOS, Linux, and Windows using Bun. No Node.js runtime required!

## Features

- **Diagnostics**: Syntax error detection on file open/change/save
- **Hover**: Show signatures and documentation for FEEL built-in functions
- **TCP and stdio modes**: Connect via standard I/O or TCP socket
- **Cross-platform binaries**: Self-contained executables for all major platforms
- **Zero runtime dependencies**: Runs without Node.js installed

## Usage

### Running the Standalone Binary

```bash
# macOS (ARM)
./dist/bin/feel-lsp-darwin-arm64 --stdio

# macOS (Intel)
./dist/bin/feel-lsp-darwin-x64 --stdio

# Linux (x64)
./dist/bin/feel-lsp-linux-x64 --stdio

# Linux (ARM)
./dist/bin/feel-lsp-linux-arm64 --stdio

# Windows
./dist/bin/feel-lsp-win32-x64.exe --stdio
```

### TCP Mode

```bash
# Start on port 7345
./dist/bin/feel-lsp-darwin-arm64 --tcp :7345

# Start on specific host and port
./dist/bin/feel-lsp-darwin-arm64 --tcp 0.0.0.0:7345
```

### Programmatic

```typescript
import { createServer } from '@feel/lsp-server';

const connection = createServer();
```

## Configuration

The server accepts the following settings:

```json
{
  "feel": {
    "dialect": "standard",
    "maxFileSize": 1048576,
    "logLevel": "info"
  }
}
```

## Building from Source

### Build TypeScript (for development)

```bash
pnpm build
```

### Build Standalone Binaries

```bash
pnpm build:binaries
```

This creates executables for all platforms in `dist/bin/`:
- `feel-lsp-darwin-x64` - macOS Intel
- `feel-lsp-darwin-arm64` - macOS Apple Silicon
- `feel-lsp-linux-x64` - Linux x64 (baseline glibc)
- `feel-lsp-linux-arm64` - Linux ARM64
- `feel-lsp-win32-x64.exe` - Windows x64

## Testing with IntelliJ IDEA

1. Start a server binary in TCP mode:
   ```bash
   ./dist/bin/feel-lsp-darwin-arm64 --tcp :7345
   ```

2. In IntelliJ IDEA:
   - Go to Settings → Languages & Frameworks → Language Server Protocol
   - Add a new server configuration
   - Set the command to connect via TCP: `localhost:7345`
   - Associate with `.feel` file extension

3. Open a `.feel` file and test the features

**Note**: The IntelliJ plugin bundles the binaries automatically - no manual setup needed!

## Supported LSP Methods

- `textDocument/didOpen`
- `textDocument/didChange`
- `textDocument/didSave`
- `textDocument/publishDiagnostics`
- `textDocument/hover`
