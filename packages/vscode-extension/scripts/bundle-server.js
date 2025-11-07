#!/usr/bin/env node

/**
 * Bundle the LSP server into the VS Code extension
 * This script copies the bundled LSP server files and necessary dependencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, '..');
const lspServerRoot = path.resolve(extensionRoot, '..', 'lsp-server');
const distServerDir = path.join(extensionRoot, 'dist', 'server');

console.log('Bundling LSP server...');

// Clean and create dist/server directory
if (fs.existsSync(distServerDir)) {
  fs.rmSync(distServerDir, { recursive: true });
}
fs.mkdirSync(distServerDir, { recursive: true });

// Copy the bundled CLI file (contains all @feel/* dependencies)
const cliSource = path.join(lspServerRoot, 'dist', 'cli.js');
const cliDest = path.join(distServerDir, 'cli.js');
fs.copyFileSync(cliSource, cliDest);
console.log('✓ Copied cli.js');

// Copy sourcemaps if they exist
const cliMapSource = path.join(lspServerRoot, 'dist', 'cli.js.map');
const cliMapDest = path.join(distServerDir, 'cli.js.map');
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
  path.join(distServerDir, 'package.json'),
  JSON.stringify(bundledPackageJson, null, 2)
);
console.log('✓ Created package.json');

// Install production dependencies
console.log('Installing production dependencies...');
const { execSync } = await import('child_process');
try {
  execSync('npm install --omit=dev --no-package-lock', {
    cwd: distServerDir,
    stdio: 'inherit',
  });
  console.log('✓ Installed dependencies');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('✓ LSP server bundled successfully');
