module.exports = {
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
    ['@babel/preset-env', { bugfixes: true, exclude: ['@babel/plugin-transform-typeof-symbol'] }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ]
};
