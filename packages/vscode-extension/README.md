# @feel/vscode-extension

VS Code extension for FEEL language support.

## Status

🚧 **Not yet implemented** - Placeholder for future development

## Planned Features

- Syntax highlighting for `.feel` files
- Language server client integration
- Diagnostics (syntax errors)
- Hover information for built-in functions
- Code completion for keywords and built-ins
- Semantic tokens for enhanced syntax highlighting

## Development Plan

1. Create VS Code extension manifest (`package.json`)
2. Define language configuration for `.feel` files
3. Implement language client using `vscode-languageclient`
4. Configure server launcher (spawn `@feel/lsp-server`)
5. Add extension activation logic
6. Package and test locally

## References

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Language Server Extension Guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
