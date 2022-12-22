import { extends as _extends } from './_virtual/_rollupPluginBabelHelpers.js';

var applyMiddleware = function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function (api, config) {
    return middlewares.reduceRight(function (set, middleware) {
      return middleware(_extends({}, api, {
        set: set
      }), config);
    }, api.set);
  };
};

export { applyMiddleware };
