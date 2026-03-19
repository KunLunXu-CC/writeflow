import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = dirname(fileURLToPath(import.meta.url));
const cssFilename = 'index.css';
// We rewrite built entry files in onSuccess, so the original JS sourcemap comment becomes stale.
const JS_SOURCE_MAP_COMMENT_PATTERN = /\n\/\/# sourceMappingURL=.*$/;

const stripJsSourceMapComment = (code: string) => code.replace(JS_SOURCE_MAP_COMMENT_PATTERN, '');

// Prepend the CSS import to the ESM entry point if it's not already present
const prependEsmCssImport = (code: string) => {
  const cssImport = `import './${cssFilename}';\n`;
  const normalizedCode = stripJsSourceMapComment(code);

  if (normalizedCode.includes(cssImport)) {
    return normalizedCode;
  }

  return `${cssImport}${normalizedCode}`;
};

// Prepend the CSS require to the CJS entry point if it's not already present
const prependCjsCssRequire = (code: string) => {
  const cssRequire = `require('./${cssFilename}');\n`;
  const normalizedCode = stripJsSourceMapComment(code);

  if (normalizedCode.includes(cssRequire)) {
    return normalizedCode;
  }

  if (normalizedCode.startsWith('"use strict";\n')) {
    return `"use strict";\n${cssRequire}${normalizedCode.slice('"use strict";\n'.length)}`;
  }

  return `${cssRequire}${normalizedCode}`;
};

const linkEntryCss = async (cwd = process.cwd()) => {
  const distDir = resolve(cwd, 'dist');
  const cssEntryPath = resolve(distDir, cssFilename);

  try {
    await readFile(cssEntryPath, 'utf8');
  } catch {
    return;
  }

  await Promise.all([
    (async () => {
      const entryPath = resolve(distDir, 'index.js');
      const code = await readFile(entryPath, 'utf8');
      await writeFile(entryPath, prependEsmCssImport(code), 'utf8');
    })(),
    (async () => {
      const entryPath = resolve(distDir, 'index.cjs');
      const code = await readFile(entryPath, 'utf8');
      await writeFile(entryPath, prependCjsCssRequire(code), 'utf8');
    })(),
  ]);
};

export default defineConfig({
  tsconfig: resolve(configDir, 'tsconfig.build.json'),
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  esbuildPlugins: [sassPlugin()],
  onSuccess: async () => {
    await linkEntryCss();  // Re-link the emitted CSS from the package entry so consumers get styles via normal bundler CSS handling.
  },
});
