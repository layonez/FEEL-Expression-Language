#!/usr/bin/env node

/**
 * Bundle the LSP server binaries into the VS Code extension
 * This script copies the standalone executable binaries (no Node.js dependencies needed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, '..');
const lspServerRoot = path.resolve(extensionRoot, '..', 'lsp-server');
const distBinDir = path.join(extensionRoot, 'dist', 'bin');

console.log('Bundling LSP server binaries...');

// Clean and create dist/bin directory
if (fs.existsSync(distBinDir)) {
  fs.rmSync(distBinDir, { recursive: true });
}
fs.mkdirSync(distBinDir, { recursive: true });

// Copy all platform binaries
const lspServerBinDir = path.join(lspServerRoot, 'dist', 'bin');

if (!fs.existsSync(lspServerBinDir)) {
  console.error('❌ LSP server binaries not found. Run "pnpm build:binaries" first.');
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
  const dest = path.join(distBinDir, binary);

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

console.log('✓ LSP server binaries bundled successfully');
