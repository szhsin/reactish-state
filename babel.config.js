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
  plugins: [
    'pure-annotations',
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        include: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-catch-binding'
        ],
        exclude: ['@babel/plugin-transform-typeof-symbol']
      }
    ],
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ]
};
