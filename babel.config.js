module.exports = {
  targets: 'defaults',
  assumptions: {
    constantReexports: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    iterableIsArray: true,
    noDocumentAll: true,
    noIncompleteNsImportDetection: true,
    noNewArrows: true,
    objectRestNoSymbols: true,
    pureGetters: true,
    setComputedProperties: true,
    setSpreadProperties: true,
    skipForOfIteratorClosing: true
  },
  plugins: ['pure-annotations'],
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        include: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ],
        exclude: ['@babel/plugin-transform-typeof-symbol']
      }
    ],
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ]
};
