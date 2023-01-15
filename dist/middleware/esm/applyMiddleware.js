import { extends as _extends } from './_virtual/_rollupPluginBabelHelpers.js';

var applyMiddleware = function applyMiddleware(middlewares, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    fromRight = _ref.fromRight;
  return function (api, config) {
    return middlewares[fromRight ? 'reduceRight' : 'reduce'](function (set, middleware) {
      return middleware ? middleware(_extends({}, api, {
        set: set
      }), config) : set;
    }, api.set);
  };
};

export { applyMiddleware };
