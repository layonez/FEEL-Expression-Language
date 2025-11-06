# @feel/lsp-server

Language Server Protocol (LSP) server for FEEL (Friendly Enough Expression Language).

## Features

- **Diagnostics**: Syntax error detection on file open/change/save
- **Hover**: Show signatures and documentation for FEEL built-in functions
- **TCP and stdio modes**: Connect via standard I/O or TCP socket

## Usage

### Command Line

```bash
# Start in stdio mode (default)
feel-lsp --stdio

# Start in TCP mode on port 7345
feel-lsp --tcp :7345

# Start in TCP mode on specific host and port
feel-lsp --tcp 0.0.0.0:7345
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

## Testing with IntelliJ IDEA

1. Start the server in TCP mode:
   ```bash
   pnpm lsp:start:tcp
   ```

2. In IntelliJ IDEA:
   - Go to Settings → Languages & Frameworks → Language Server Protocol
   - Add a new server configuration
   - Set the command to connect via TCP: `localhost:7345`
   - Associate with `.feel` file extension

3. Open a `.feel` file and test the features

## Supported LSP Methods

- `textDocument/didOpen`
- `textDocument/didChange`
- `textDocument/didSave`
- `textDocument/publishDiagnostics`
- `textDocument/hover`
