import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  tsconfig: resolve(configDir, 'tsconfig.build.json'),
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  injectStyle: true,
  esbuildPlugins: [sassPlugin()],
});
