# FEEL Language Support for VS Code

Language support for FEEL (Friendly Enough Expression Language) in Visual Studio Code.

## Features

All features are provided by the **FEEL Language Server** via LSP:

- ✅ **Syntax Highlighting** - Semantic tokens from LSP (uses lezer-feel parser)
- ✅ **Diagnostics** - Real-time syntax error detection
- ✅ **Hover Documentation** - Function signatures and descriptions for 43 built-in functions
- ✅ **Code Completion** - IntelliSense for keywords and built-in functions
- ✅ **Language Configuration** - Auto-closing brackets, comments, indentation

This extension is a **lean wrapper** around the LSP server - all intelligence comes from `@feel/lsp-server`.

## Installation (Development)

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Visual Studio Code >= 1.80

### Setup

1. **Build the extension and server:**
   ```bash
   cd /Users/I745628/projects/FEEL-Expression-Language
   pnpm install
   pnpm build
   ```

2. **Open in VS Code:**
   ```bash
   code packages/vscode-extension
   ```

3. **Launch Extension Development Host:**
   - Press `F5` or go to **Run → Start Debugging**
   - A new VS Code window will open with the extension activated

4. **Test the extension:**
   - In the Extension Development Host, open a `.feel` file
   - Or create a new file with `.feel` extension
   - Try the features:
     - Type to see syntax highlighting
     - Hover over built-in functions like `sum`, `date`, `substring`
     - Press `Ctrl+Space` for completions
     - Introduce syntax errors to see diagnostics

## Usage

### Open FEEL Files

Open any file with `.feel` extension to activate the language support.

### Code Completion

Type `Ctrl+Space` (or `Cmd+Space` on macOS) to trigger completions:
- **Keywords**: `if`, `then`, `else`, `for`, `in`, `return`, etc.
- **Built-in Functions**: `sum`, `count`, `substring`, `date`, etc.

### Hover Documentation

Hover over any built-in function to see:
- Function signature
- Description
- Parameters with types
- Return type

Example: Hover over `sum` to see: `sum(list: list): number`

### Diagnostics

Syntax errors are shown in real-time with:
- Red squiggles under errors
- Error messages in the Problems panel
- Contextual error descriptions like:
  - "Incomplete <IfExpression>"
  - "Unrecognized token <X> in <Y>"

## Configuration

Configure the extension in VS Code settings:

```json
{
  "feel.server.path": "",  // Path to custom LSP server (optional)
  "feel.server.maxFileSize": 1048576,  // Max file size in bytes
  "feel.trace.server": "off"  // LSP communication tracing
}
```

## Extension Structure

**Lean wrapper** (90 lines of code):

```
packages/vscode-extension/
├── src/
│   └── extension.ts              # Extension entry point (spawns LSP server)
├── scripts/
│   └── bundle-server.js          # Bundles LSP server into extension
├── dist/                         # 🎁 Fully bundled - ready to package!
│   ├── extension.cjs             # Extension + vscode-languageclient (775 KB)
│   └── server/                   # Bundled LSP server (self-sufficient)
│       ├── cli.js                # LSP server + @feel/core (221 KB)
│       ├── cli.js.map
│       ├── node_modules/         # Only LSP protocol libs (1.6 MB)
│       └── package.json          # Minimal deps
├── .vscode/
│   ├── launch.json               # F5 debugging configuration
│   └── tasks.json                # Build tasks
├── language-configuration.json   # Brackets, comments, indentation
├── package.json                  # Extension manifest
├── tsup.config.ts                # Bundles vscode-languageclient
└── README.md
```

**All intelligence** comes from `@feel/lsp-server` which uses:
- `lezer-feel` parser with built-in highlighting
- `@feel/core` for diagnostics and built-in function metadata

### Build Process

The extension is **completely self-sufficient** with zero external dependencies at runtime:

1. **LSP Server Build** (`pnpm build:server`):
   - Builds `@feel/lsp-server` with tsup
   - Bundles `@feel/core` into `cli.js` using `noExternal` config
   - Results in a single `cli.js` file (~221 KB) with all workspace dependencies

2. **Extension Build** (`pnpm build:extension`):
   - Compiles `extension.ts` to `extension.cjs` with tsup
   - **Bundles `vscode-languageclient`** into the extension (~775 KB total)
   - Only `vscode` API remains external (provided by VS Code)

3. **Server Bundling** (`pnpm bundle:server`):
   - Copies bundled `cli.js` to `dist/server/`
   - Creates minimal `package.json` with only LSP protocol dependencies:
     - `vscode-languageserver`
     - `vscode-languageserver-textdocument`
   - Runs `npm install` to fetch these dependencies (~1.6 MB)

**Result**: The entire extension package contains:
- `extension.cjs` (775 KB) - Extension code + LSP client (bundled)
- `server/cli.js` (221 KB) - LSP server + FEEL core (bundled)
- `server/node_modules/` (1.6 MB) - LSP protocol libraries only

**Total size**: ~2.6 MB with zero workspace dependencies!

This approach ensures the extension can be packaged and distributed without requiring:
- The monorepo structure
- Workspace dependency resolution
- Any `node_modules` installation by users
- Any additional build steps

## Development

### Building

```bash
# Build extension
pnpm build

# Watch mode
pnpm dev
```

### Debugging

1. Open `packages/vscode-extension` in VS Code
2. Press `F5` to launch Extension Development Host
3. Set breakpoints in `src/extension.ts`
4. Reload the Extension Development Host window to see changes

### Packaging

```bash
# Create VSIX package
pnpm package

# Output: vscode-feel-0.0.1.vsix
```

## Testing Examples

The `examples/` directory contains comprehensive FEEL examples:

- `01-basic-types.feel` - Data types and literals
- `06-string-functions.feel` - String functions with hover docs
- `07-list-functions.feel` - List operations
- `99-syntax-errors.feel` - Diagnostic testing

## Troubleshooting

### Server not found error

If you see "FEEL Language Server not found", ensure:
1. You've run `pnpm build` in the workspace root
2. The `packages/lsp-server/dist/cli.js` file exists
3. Or configure `feel.server.path` in settings

### No completions appearing

- Make sure the `.feel` file extension is recognized
- Check the Output panel → "FEEL Language Server" for errors
- Try reloading the window: `Ctrl+Shift+P` → "Reload Window"

### Diagnostics not showing

- Save the file to trigger validation
- Check if the file is too large (`feel.server.maxFileSize`)
- Enable tracing: `"feel.trace.server": "verbose"` and check Output panel

## References

- [DMN 1.3 Specification](https://www.omg.org/spec/DMN/1.3/)
- [FEEL Specification](https://www.omg.org/spec/DMN/1.3/PDF)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
