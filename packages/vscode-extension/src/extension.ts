import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  Executable,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

/**
 * Get the appropriate binary name for the current platform
 */
function getBinaryName(): string {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'feel-lsp-darwin-arm64' : 'feel-lsp-darwin-x64';
  } else if (platform === 'linux') {
    return arch === 'arm64' ? 'feel-lsp-linux-arm64' : 'feel-lsp-linux-x64';
  } else if (platform === 'win32') {
    return 'feel-lsp-win32-x64.exe';
  }

  throw new Error(`Unsupported platform: ${platform}-${arch}`);
}

export function activate(context: vscode.ExtensionContext) {
  console.log('FEEL extension activated');

  // Get configuration
  const config = vscode.workspace.getConfiguration('feel');
  let serverPath = config.get<string>('server.path');

  if (!serverPath || serverPath.trim() === '') {
    const binaryName = getBinaryName();

    // Try bundled binary first (for production/packaged extension)
    const bundledBinary = context.asAbsolutePath(
      path.join('dist', 'bin', binaryName)
    );

    // Fall back to development path (for F5 debugging in monorepo)
    const devBinary = context.asAbsolutePath(
      path.join('..', 'lsp-server', 'dist', 'bin', binaryName)
    );

    serverPath = fs.existsSync(bundledBinary) ? bundledBinary : devBinary;
  }

  // Verify server exists
  if (!fs.existsSync(serverPath)) {
    void vscode.window.showErrorMessage(
      `FEEL Language Server not found at: ${serverPath}. Please build the server binaries with 'pnpm build:binaries'.`
    );
    return;
  }

  console.log(`Using FEEL Language Server binary at: ${serverPath}`);

  // Server options: execute the standalone binary
  const serverExecutable: Executable = {
    command: serverPath,
    args: ['--stdio'],
  };

  const serverOptions: ServerOptions = {
    run: serverExecutable,
    debug: serverExecutable,
  };

  // Client options: register for .feel files
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      {
        scheme: 'file',
        language: 'feel',
      },
    ],
    synchronize: {
      // Notify the server about file changes to .feel files
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.feel'),
    },
  };

  // Create and start the language client
  client = new LanguageClient(
    'feelLanguageServer',
    'FEEL Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client (this will also start the server)
  client.start();

  console.log('FEEL Language Client started');
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
