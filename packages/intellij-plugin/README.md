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
- **JDK** 21+
- **pnpm** >= 9 (for building from source only)

**No runtime dependencies**: The plugin bundles standalone LSP server binaries - Node.js is NOT required on user machines!

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
│   │       ├── FeelLspServerConnectionProvider.kt    # Server binary spawner
│   │       └── FeelLspServerLifecycleListener.kt     # Lifecycle management
│   └── resources/
│       ├── META-INF/plugin.xml      # Plugin descriptor
│       ├── icons/feel.svg           # File icon
│       └── lsp-server/              # 🎁 Bundled LSP server binaries (created by build)
│           ├── feel-lsp-darwin-x64       # macOS Intel (64 MB)
│           ├── feel-lsp-darwin-arm64     # macOS Apple Silicon (58 MB)
│           ├── feel-lsp-linux-x64        # Linux x64 (100 MB)
│           ├── feel-lsp-linux-arm64      # Linux ARM64 (94 MB)
│           └── feel-lsp-win32-x64.exe    # Windows x64 (115 MB)
├── scripts/
│   └── bundle-server.js             # Bundles LSP server into plugin
├── build.gradle.kts                 # Gradle build configuration
├── settings.gradle.kts              # Gradle settings
├── gradle.properties                # Plugin properties
└── package.json                     # pnpm build scripts
```

## Build Process

The plugin is **completely self-sufficient** with zero runtime dependencies:

1. **LSP Server Binary Build** (`pnpm build:binaries`):
   - Compiles `@feel/lsp-server` into standalone executables using Bun
   - Creates binaries for macOS (x64, ARM64), Linux (x64, ARM64), and Windows (x64)
   - Each binary is self-contained with Bun runtime embedded

2. **Binary Bundling** (`pnpm bundle:binaries`):
   - Copies all platform binaries to `src/main/resources/lsp-server/`
   - Sets executable permissions for Unix binaries

3. **Plugin Build** (`./gradlew buildPlugin`):
   - Compiles Kotlin sources
   - Packages everything into plugin ZIP
   - Includes all platform binaries in resources

**Result**: The plugin ZIP contains everything needed to run:
- Plugin classes (Kotlin compiled)
- Standalone LSP binaries for all platforms (~330 MB total)
- Icon and manifest files
- No Node.js or npm dependencies required!

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

### Platform Binary Selection

The plugin automatically selects the appropriate binary based on:
- Operating system (macOS, Linux, Windows)
- CPU architecture (x64, ARM64)

No external runtime dependencies are required.

## Troubleshooting

### Binary not found or not executable

**Error**: "FEEL Language Server binary not found. Plugin may be corrupted or incompatible with your platform."

**Solution**: Rebuild the plugin with all binaries:
```bash
cd packages/intellij-plugin
pnpm build
```

### Unsupported platform

**Error**: "Unsupported platform: [OS]-[ARCH]"

**Solution**: This occurs on unsupported platforms. Currently supported:
- macOS (x64, ARM64)
- Linux (x64, ARM64)
- Windows (x64)

### No completions or diagnostics

1. Check IntelliJ logs: **Help** → **Show Log in Finder/Explorer**
2. Look for "FEEL" entries to see server binary startup errors
3. Verify the binary is executable: `ls -l [plugin-path]/lsp-server/`
4. Try restarting IntelliJ

### LSP4IJ dependency missing

**Error**: Plugin fails to load with missing class errors

**Solution**: Ensure IntelliJ 2024.3+ which includes LSP4IJ bundled plugin

### Binary file permissions (Linux/macOS)

If the binary doesn't execute, you may need to mark it as executable:
```bash
chmod +x [plugin-path]/lsp-server/feel-lsp-*
```

## Comparison with VS Code Extension

| Aspect | VS Code Extension | IntelliJ Plugin |
|--------|------------------|-----------------|
| **Implementation** | TypeScript | Kotlin (~400 LOC) |
| **LSP Client** | vscode-languageclient | LSP4IJ (bundled) |
| **Server Startup** | Spawns platform binary | ProcessStreamConnectionProvider spawns binary |
| **File Type** | JSON contribution | Kotlin FileType class |
| **Bundling** | dist/bin/ (all platforms) | resources/lsp-server/ (all platforms) |
| **Build Tool** | tsup | Gradle |
| **Package** | VSIX (~330 MB, all platforms) | ZIP (~330 MB, all platforms) |
| **Runtime Dependencies** | None (standalone binaries) | None (standalone binaries) |

Both follow the same principle: **lean wrapper around platform-specific standalone binaries**.

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
