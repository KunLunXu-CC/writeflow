import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Options } from 'tsup';
import sharedConfig from '../../tsup.config.ts';

const configDir = dirname(fileURLToPath(import.meta.url));
const reactRuntimeExternal = ['react', 'react/*', 'react-dom', 'react-dom/*'];

const resolvedSharedConfig = Array.isArray(sharedConfig) ? sharedConfig[0] : sharedConfig;
const baseConfig: Options = typeof resolvedSharedConfig === 'function' ? {} : resolvedSharedConfig;

export default defineConfig({
  ...baseConfig,
  tsconfig: resolve(configDir, 'tsconfig.build.json'),
  inject: [],
  jsxFactory: undefined,
  jsxFragment: undefined,
  external: [...new Set([...(baseConfig.external ?? []), ...reactRuntimeExternal])],
  esbuildOptions(options, context) {
    if (typeof resolvedSharedConfig !== 'function') {
      resolvedSharedConfig.esbuildOptions?.(options, context);
    }
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
    delete options.jsxFactory;
    delete options.jsxFragment;
    options.external = [...new Set([...(options.external ?? []), ...reactRuntimeExternal])];
  },
});
