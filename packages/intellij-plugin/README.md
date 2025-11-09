# @feel/intellij-plugin

IntelliJ IDEA plugin for FEEL language support.

## Status

✅ **Implemented** - Lean LSP wrapper following VS Code extension pattern

## Features

All features are provided by the **FEEL Language Server** via LSP4IJ:

- ✅ **Syntax Highlighting** - Semantic tokens from LSP (uses lezer-feel parser)
- ✅ **Diagnostics** - Real-time syntax error detection
- ✅ **Hover Documentation** - Function signatures and descriptions for 80+ built-in functions
- ✅ **Code Completion** - IntelliSense for keywords and built-in functions
- ✅ **File Type Support** - Automatic language activation for `.feel` files

This plugin is a **lean wrapper** around the LSP server - all intelligence comes from `@feel/lsp-server`.

## Prerequisites

- **IntelliJ IDEA** 2024.3+ (Community or Ultimate)
- **Node.js** >= 20 (must be installed and available in PATH)
- **JDK** 21+
- **pnpm** >= 9 (for building from source)

## Installation

### From Source (Development)

1. **Build the plugin:**
   ```bash
   cd /Users/I745628/projects/FEEL-Expression-Language
   pnpm install
   cd packages/intellij-plugin
   pnpm build
   ```

2. **Install in IntelliJ:**
   - Go to **Settings** → **Plugins** → **⚙️** → **Install Plugin from Disk...**
   - Select `packages/intellij-plugin/build/distributions/intellij-feel-plugin-0.0.1.zip`
   - Restart IntelliJ IDEA

3. **Test the plugin:**
   - Open or create a `.feel` file (e.g., `examples/test.feel`)
   - Verify features:
     - Syntax highlighting
     - Hover over built-in functions like `sum`, `date`, `substring`
     - Press `Ctrl+Space` for completions
     - See diagnostics on syntax errors

### From Marketplace (Future)

Once published, install directly from JetBrains Marketplace.

## Architecture

This plugin follows the same architecture as the VS Code extension:

```
packages/intellij-plugin/
├── src/main/
│   ├── kotlin/com/feel/plugin/
│   │   ├── FeelLanguage.kt          # Language definition
│   │   ├── FeelFileType.kt          # File type registration
│   │   ├── FeelFile.kt              # PSI file
│   │   ├── FeelParserDefinition.kt  # Minimal parser (LSP handles parsing)
│   │   ├── FeelIcons.kt             # Icon provider
│   │   └── lsp/
│   │       ├── FeelLspServerSupportProvider.kt       # LSP4IJ integration
│   │       ├── FeelLspServerConnectionProvider.kt    # Server process spawner
│   │       └── FeelLspServerLifecycleListener.kt     # Lifecycle management
│   └── resources/
│       ├── META-INF/plugin.xml      # Plugin descriptor
│       ├── icons/feel.svg           # File icon
│       └── lsp-server/              # 🎁 Bundled LSP server (created by build)
│           ├── cli.js               # LSP server + @feel/core (221 KB)
│           ├── node_modules/        # LSP protocol libraries (1.6 MB)
│           └── package.json         # Minimal deps
├── scripts/
│   └── bundle-server.js             # Bundles LSP server into plugin
├── build.gradle.kts                 # Gradle build configuration
├── settings.gradle.kts              # Gradle settings
├── gradle.properties                # Plugin properties
└── package.json                     # pnpm build scripts
```

## Build Process

The plugin is **completely self-sufficient** with zero external dependencies at runtime:

1. **LSP Server Build** (`pnpm build:server`):
   - Builds `@feel/lsp-server` with tsup
   - Bundles `@feel/core` into `cli.js`

2. **Server Bundling** (`pnpm bundle:server`):
   - Copies bundled `cli.js` to `src/main/resources/lsp-server/`
   - Creates minimal `package.json` with LSP protocol dependencies
   - Runs `npm install` for dependencies

3. **Plugin Build** (`./gradlew buildPlugin`):
   - Compiles Kotlin sources
   - Packages everything into plugin ZIP
   - Includes bundled LSP server in resources

**Result**: The plugin ZIP contains everything needed to run, including:
- Plugin classes (Kotlin compiled)
- Bundled LSP server (`cli.js` + node_modules)
- Icon and manifest files

## Development

### Building

```bash
# Build entire plugin (server + plugin)
pnpm build

# Build only the plugin (assumes server is built)
./gradlew buildPlugin

# Clean build artifacts
pnpm clean
# or
./gradlew clean
```

### Running in IDE Sandbox

```bash
# Launch IntelliJ with plugin in sandbox
pnpm dev
# or
./gradlew runIde
```

This opens a new IntelliJ window with the plugin installed for testing.

### Debugging

1. Run `./gradlew runIde --debug-jvm` to start with debugger
2. Attach IntelliJ debugger to port 5005
3. Set breakpoints in Kotlin source files
4. Open `.feel` files in the sandbox to trigger breakpoints

### Verifying Plugin

```bash
# Verify plugin compatibility
pnpm verify
# or
./gradlew verifyPlugin
```

## LSP Integration Details

The plugin uses **LSP4IJ** (bundled with IntelliJ Platform) to integrate with the FEEL Language Server:

1. **FeelLspServerSupportProvider**: Registers LSP support for `.feel` files
2. **FeelLspServerConnectionProvider**: Spawns Node.js process with bundled server
3. **Server Discovery**: Automatically finds Node.js and bundled `cli.js`
4. **Protocol**: Communicates via stdio (same as VS Code)

### Node.js Detection

The plugin automatically searches for Node.js in common locations:
- System PATH
- `/usr/local/bin/node`
- `/usr/bin/node`
- `/opt/homebrew/bin/node` (macOS)
- `C:\Program Files\nodejs\node.exe` (Windows)

If Node.js is not found, the plugin shows an error message.

## Troubleshooting

### Node.js not found

**Error**: "Node.js not found. Please install Node.js to use FEEL language support."

**Solution**: Install Node.js 20+ and ensure it's available in your PATH:
```bash
node --version  # Should print v20.x.x or higher
```

### Server not found

**Error**: "FEEL Language Server not found. Plugin may be corrupted."

**Solution**: Rebuild the plugin:
```bash
cd packages/intellij-plugin
pnpm build
```

### No completions or diagnostics

1. Check IntelliJ logs: **Help** → **Show Log in Finder/Explorer**
2. Look for "FEEL" entries to see server startup errors
3. Verify Node.js is working: `node --version`
4. Try restarting IntelliJ

### LSP4IJ dependency missing

**Error**: Plugin fails to load with missing class errors

**Solution**: Ensure IntelliJ 2024.3+ which includes LSP4IJ bundled plugin

## Comparison with VS Code Extension

| Aspect | VS Code Extension | IntelliJ Plugin |
|--------|------------------|-----------------|
| **Implementation** | TypeScript (~90 LOC) | Kotlin (~400 LOC) |
| **LSP Client** | vscode-languageclient | LSP4IJ (bundled) |
| **Server Startup** | Node spawn via LanguageClient | ProcessStreamConnectionProvider |
| **File Type** | JSON contribution | Kotlin FileType class |
| **Bundling** | dist/server/ | resources/lsp-server/ |
| **Build Tool** | tsup | Gradle |
| **Package** | VSIX (~2.6 MB) | ZIP (~3 MB) |

Both follow the same principle: **lean wrapper around bundled LSP server**.

## Publishing

### To JetBrains Marketplace

1. Create account at [JetBrains Marketplace](https://plugins.jetbrains.com)
2. Configure signing and publishing:
   ```bash
   export PUBLISH_TOKEN="your-token"
   ./gradlew publishPlugin
   ```

3. Or manually upload `build/distributions/intellij-feel-plugin-0.0.1.zip`

## References

- [IntelliJ Platform Plugin SDK](https://plugins.jetbrains.com/docs/intellij/welcome.html)
- [LSP4IJ Documentation](https://github.com/redhat-developer/lsp4ij)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [DMN 1.3 Specification](https://www.omg.org/spec/DMN/1.3/)

## License

ISC 
