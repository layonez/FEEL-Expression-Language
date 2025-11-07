import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['vscode'], // Only vscode API is external
  platform: 'node',
  target: 'node20',
  splitting: false,
  treeshake: true,
  // Bundle vscode-languageclient into the extension
  noExternal: ['vscode-languageclient'],
});
