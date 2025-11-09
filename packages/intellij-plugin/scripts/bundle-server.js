#!/usr/bin/env node

/**
 * Bundle the LSP server into the IntelliJ plugin
 * This script copies the bundled LSP server files and necessary dependencies
 * Similar to VS Code extension's bundle-server.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, '..');
const lspServerRoot = path.resolve(pluginRoot, '..', 'lsp-server');
const resourcesDir = path.join(pluginRoot, 'src', 'main', 'resources', 'lsp-server');

console.log('Bundling LSP server for IntelliJ plugin...');

// Clean and create resources/lsp-server directory
if (fs.existsSync(resourcesDir)) {
  fs.rmSync(resourcesDir, { recursive: true });
}
fs.mkdirSync(resourcesDir, { recursive: true });

// Copy the bundled CLI file (contains all @feel/* dependencies)
const cliSource = path.join(lspServerRoot, 'dist', 'cli.js');
const cliDest = path.join(resourcesDir, 'cli.js');

if (!fs.existsSync(cliSource)) {
  console.error(`Error: LSP server not found at ${cliSource}`);
  console.error('Please build the LSP server first: cd ../lsp-server && pnpm build');
  process.exit(1);
}

fs.copyFileSync(cliSource, cliDest);
console.log('✓ Copied cli.js');

// Copy sourcemaps if they exist
const cliMapSource = path.join(lspServerRoot, 'dist', 'cli.js.map');
const cliMapDest = path.join(resourcesDir, 'cli.js.map');
if (fs.existsSync(cliMapSource)) {
  fs.copyFileSync(cliMapSource, cliMapDest);
  console.log('✓ Copied cli.js.map');
}

// Create a minimal package.json with only the external dependencies
const lspPackageJson = JSON.parse(
  fs.readFileSync(path.join(lspServerRoot, 'package.json'), 'utf8')
);

const bundledPackageJson = {
  name: '@feel/lsp-server',
  version: lspPackageJson.version,
  type: 'module',
  main: './cli.js',
  dependencies: {
    // Only include external dependencies (not workspace packages which are bundled)
    'vscode-languageserver': lspPackageJson.dependencies['vscode-languageserver'],
    'vscode-languageserver-textdocument': lspPackageJson.dependencies['vscode-languageserver-textdocument'],
  },
};

fs.writeFileSync(
  path.join(resourcesDir, 'package.json'),
  JSON.stringify(bundledPackageJson, null, 2)
);
console.log('✓ Created package.json');

// Install production dependencies
console.log('Installing production dependencies...');
const { execSync } = await import('child_process');
try {
  execSync('npm install --omit=dev --no-package-lock', {
    cwd: resourcesDir,
    stdio: 'inherit',
  });
  console.log('✓ Installed dependencies');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('✓ LSP server bundled successfully for IntelliJ plugin');
