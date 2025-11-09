#!/usr/bin/env node

/**
 * Bundle the LSP server binaries into the IntelliJ plugin
 * This script copies the standalone executable binaries (no Node.js dependencies needed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, '..');
const lspServerRoot = path.resolve(pluginRoot, '..', 'lsp-server');
const resourcesDir = path.join(pluginRoot, 'src', 'main', 'resources', 'lsp-server');

console.log('Bundling LSP server binaries for IntelliJ plugin...');

// Clean and create resources/lsp-server directory
if (fs.existsSync(resourcesDir)) {
  fs.rmSync(resourcesDir, { recursive: true });
}
fs.mkdirSync(resourcesDir, { recursive: true });

// Copy all platform binaries
const lspServerBinDir = path.join(lspServerRoot, 'dist', 'bin');

if (!fs.existsSync(lspServerBinDir)) {
  console.error('❌ LSP server binaries not found. Run "pnpm build:binaries" first.');
  console.error(`Expected directory: ${lspServerBinDir}`);
  process.exit(1);
}

const binaries = [
  'feel-lsp-darwin-x64',
  'feel-lsp-darwin-arm64',
  'feel-lsp-linux-x64',
  'feel-lsp-linux-arm64',
  'feel-lsp-win32-x64.exe',
];

for (const binary of binaries) {
  const source = path.join(lspServerBinDir, binary);
  const dest = path.join(resourcesDir, binary);

  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    // Make executable on Unix-like systems
    if (!binary.endsWith('.exe')) {
      fs.chmodSync(dest, 0o755);
    }
    console.log(`✓ Copied ${binary}`);
  } else {
    console.warn(`⚠ ${binary} not found, skipping`);
  }
}

console.log('✓ LSP server binaries bundled successfully for IntelliJ plugin');
