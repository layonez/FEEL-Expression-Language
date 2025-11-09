#!/usr/bin/env tsx
/**
 * Build cross-platform standalone executables for FEEL LSP server using Bun
 *
 * This script compiles the LSP server into standalone binaries for:
 * - macOS (x64, arm64)
 * - Linux (x64, arm64, baseline for broader glibc compatibility)
 * - Windows (x64)
 *
 * Usage: pnpm build:binaries
 */

import { $ } from 'bun';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const TARGETS = [
  { platform: 'darwin', arch: 'x64', target: 'bun-darwin-x64' },
  { platform: 'darwin', arch: 'arm64', target: 'bun-darwin-arm64' },
  { platform: 'linux', arch: 'x64', target: 'bun-linux-x64-baseline' },
  { platform: 'linux', arch: 'arm64', target: 'bun-linux-arm64' },
  { platform: 'win32', arch: 'x64', target: 'bun-windows-x64' },
] as const;

const OUTPUT_DIR = join(import.meta.dir, '..', 'dist', 'bin');
const ENTRY_POINT = join(import.meta.dir, '..', 'src', 'cli.ts');

async function buildBinaries() {
  console.log('🔨 Building FEEL LSP standalone executables...\n');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Build for each target platform
  for (const { platform, arch, target } of TARGETS) {
    const ext = platform === 'win32' ? '.exe' : '';
    const outputName = `feel-lsp-${platform}-${arch}${ext}`;
    const outputPath = join(OUTPUT_DIR, outputName);

    console.log(`📦 Building ${outputName} (${target})...`);

    try {
      await $`bun build ${ENTRY_POINT} --compile --target=${target} --outfile=${outputPath}`;
      console.log(`✅ ${outputName} created successfully`);
    } catch (error) {
      console.error(`❌ Failed to build ${outputName}:`, error);
      process.exit(1);
    }
  }

  console.log('\n🎉 All binaries built successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

buildBinaries();
