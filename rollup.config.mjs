import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const createBuild = ({
  inPath = '',
  outPath = inPath,
  inFile = 'index.ts',
  outFile = 'index.js'
} = {}) => ({
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
  input: `src/${inPath}${inFile}`,
  output: [
    {
      file: `dist/${outPath}cjs/${outFile}`,
      format: 'cjs',
      interop: 'default'
    },
    {
      dir: `dist/${outPath}es`,
      format: 'es',
      preserveModules: true
    }
  ]
});

export default [
  createBuild(),
  createBuild({ inPath: 'middleware/' }),
  createBuild({ inPath: 'middleware/', inFile: 'immer.ts', outFile: 'immer.js' }),
  createBuild({ inPath: 'plugin/' })
];
