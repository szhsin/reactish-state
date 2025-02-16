import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

/**
 * @returns {import('rollup').RollupOptions}
 */
const createBuild = ({ inPath = '', outPath = inPath, inFile = 'index.ts' } = {}) => ({
  external: ['react', 'react-dom', 'use-sync-external-store/shim', 'immer'],
  plugins: [
    nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }),
    {
      name: 'rollup-plugin-replace-code',
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
      dir: `dist/${outPath}cjs`,
      format: 'cjs',
      interop: 'default',
      entryFileNames: '[name].cjs',
      preserveModules: true
    },
    {
      dir: `dist/${outPath}esm`,
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true
    }
  ]
});

export default [
  createBuild(),
  createBuild({ inPath: 'middleware/' }),
  createBuild({ inPath: 'middleware/', inFile: 'immer.ts' }),
  createBuild({ inPath: 'plugin/' }),
  createBuild({ inPath: 'shim/' })
];
