import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const createBuild = (path = '') => ({
  external: ['react', 'react-dom', 'use-sync-external-store/shim', 'immer'],
  plugins: [
    nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  input: `src/${path}index.ts`,
  output: [
    {
      file: `dist/${path}cjs/index.js`,
      format: 'cjs',
      interop: 'default'
    },
    {
      dir: `dist/${path}es`,
      format: 'es',
      preserveModules: true
    }
  ]
});

export default [createBuild(), createBuild('middleware/')];
