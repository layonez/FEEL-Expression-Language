import { createServer } from './server.js';
import { createServer as createTcpServer } from 'net';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';

/**
 * CLI entry point for FEEL LSP server
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--stdio';

  console.error(`Starting FEEL LSP server in ${mode} mode...`);

  if (mode === '--stdio') {
    // Standard input/output mode (default)
    createServer();
    console.error('FEEL LSP server ready (stdio)');
  } else if (mode === '--tcp' || mode.startsWith('--tcp=')) {
    // TCP socket mode
    let port = 7345; // default port
    let host = '127.0.0.1';

    if (mode.startsWith('--tcp=')) {
      const addr = mode.substring(6);
      if (addr.startsWith(':')) {
        port = parseInt(addr.substring(1), 10);
      } else if (addr.includes(':')) {
        [host, port as any] = addr.split(':');
        port = parseInt(port as any, 10);
      }
    } else if (args[1]) {
      const addr = args[1];
      if (addr.startsWith(':')) {
        port = parseInt(addr.substring(1), 10);
      } else if (addr.includes(':')) {
        [host, port as any] = addr.split(':');
        port = parseInt(port as any, 10);
      }
    }

    // Create TCP server
    const server = createTcpServer((socket) => {
      console.error(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

      // Create LSP connection over the socket
      const connection = createConnection(ProposedFeatures.all, socket, socket);

      // Import and setup server handlers
      import('./server.js').then(({ createServer }) => {
        createServer();
      });

      socket.on('close', () => {
        console.error('Client disconnected');
      });
    });

    server.listen(port, host, () => {
      console.error(`FEEL LSP server listening on ${host}:${port}`);
    });

    server.on('error', (err) => {
      console.error(`Server error: ${err.message}`);
      process.exit(1);
    });
  } else {
    console.error('Usage: feel-lsp [--stdio | --tcp [host]:port]');
    console.error('  --stdio         Use stdin/stdout (default)');
    console.error('  --tcp :7345     Listen on TCP port 7345');
    console.error('  --tcp 0.0.0.0:7345  Listen on all interfaces');
    process.exit(1);
  }
}

main();
