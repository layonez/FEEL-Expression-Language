import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['vscode'],
  platform: 'node',
  target: 'node20',
  splitting: false,
  treeshake: true,
});
