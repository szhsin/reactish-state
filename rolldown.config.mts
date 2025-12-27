import { defineConfig, type RolldownOptions } from 'rolldown';
import { addDirective } from 'rollup-plugin-add-directive';

const createBuild = ({
  inPath = '',
  outPath = inPath,
  inFile = 'index.ts'
}: { inPath?: string; outPath?: string; inFile?: string } = {}): RolldownOptions => ({
  external: ['react', 'react-dom', 'use-sync-external-store/shim', 'immer'],
  plugins: [
    {
      name: 'rolldown-plugin-replace-code',
      renderChunk: (code, chunk) => {
        if (!chunk.name.endsWith('reactShim')) return null;

        return code.replace(
          'use-sync-external-store/shim',
          'use-sync-external-store/shim/index.js'
        );
      }
    }
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  input: `src/${inPath}${inFile}`,
  output: [
    {
      dir: `dist/cjs/${outPath}`,
      format: 'cjs',
      entryFileNames: '[name].cjs',
      preserveModules: true,
      // Temporary workaround until this issue is fixed:
      // https://github.com/rolldown/rolldown/issues/5865
      plugins: [addDirective({ directive: "'use strict';" })]
    },
    {
      dir: `dist/esm/${outPath}`,
      format: 'esm',
      entryFileNames: '[name].mjs',
      preserveModules: true
    }
  ],
  transform: {
    target: ['es2020'],
    assumptions: {
      noDocumentAll: true
    }
  }
});

export default defineConfig([
  createBuild(),
  createBuild({ inPath: 'middleware/' }),
  createBuild({ inPath: 'middleware/', inFile: 'immer.ts' }),
  createBuild({ inPath: 'plugin/' }),
  createBuild({ inPath: 'shim/' })
]);
