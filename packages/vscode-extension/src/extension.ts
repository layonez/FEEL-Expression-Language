import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('FEEL extension activated');

  // Get configuration
  const config = vscode.workspace.getConfiguration('feel');
  let serverPath = config.get<string>('server.path');
  if (!serverPath || serverPath.trim() === '') {
    // Try bundled server first (for production/packaged extension)
    const bundledServer = context.asAbsolutePath(
      path.join('dist', 'server', 'cli.js')
    );

    // Fall back to development path (for F5 debugging in monorepo)
    const devServer = context.asAbsolutePath(
      path.join('..', 'lsp-server', 'dist', 'cli.js')
    );

    serverPath = fs.existsSync(bundledServer) ? bundledServer : devServer;
  }

  // Verify server exists
  if (!fs.existsSync(serverPath)) {
    void vscode.window.showErrorMessage(
      `FEEL Language Server not found at: ${serverPath}. Please build the server or configure the path.`
    );
    return;
  }

  console.log(`Using FEEL Language Server at: ${serverPath}`);

  // Server options: spawn the server as stdio
  const serverOptions: ServerOptions = {
    run: {
      module: serverPath,
      transport: TransportKind.stdio,
      args: ['--stdio'],
    },
    debug: {
      module: serverPath,
      transport: TransportKind.stdio,
      args: ['--stdio'],
      options: {
        execArgv: ['--nolazy', '--inspect=6009'],
      },
    },
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
