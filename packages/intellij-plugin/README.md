# @feel/intellij-plugin

IntelliJ IDEA plugin for FEEL language support.

## Status

🚧 **Not yet implemented** - Placeholder for future development

## Planned Features

- File type registration for `.feel` files
- LSP client integration via JetBrains LSP API
- Connection to local LSP server (TCP mode)
- Diagnostics display
- Hover information for built-in functions
- Code completion
- Settings UI for server configuration

## Development Plan

1. Create IntelliJ plugin project structure
2. Define plugin descriptor (`plugin.xml`)
3. Register `.feel` file type
4. Implement LSP client using JetBrains LSP API
5. Configure TCP connection to `@feel/lsp-server`
6. Add settings panel for server configuration
7. Build and test in sandbox

## Testing Locally (Without Plugin)

You can test the LSP server with IntelliJ IDEA by:

1. Starting the LSP server in TCP mode:
   ```bash
   pnpm lsp:start:tcp
   ```

2. Configuring IntelliJ IDEA:
   - Go to **Settings** → **Languages & Frameworks** → **Language Server Protocol**
   - Click **+** to add a new server
   - Set **Language**: Custom file type association for `*.feel`
   - Set **Server mode**: TCP
   - Set **Host**: `localhost`
   - Set **Port**: `7345`
   - Click **OK** and **Apply**

3. Create a test `.feel` file and verify:
   - Syntax errors are highlighted
   - Hovering over built-in functions shows documentation

## References

- [IntelliJ Platform Plugin SDK](https://plugins.jetbrains.com/docs/intellij/welcome.html)
- [JetBrains LSP API](https://plugins.jetbrains.com/docs/intellij/language-server-protocol.html)
