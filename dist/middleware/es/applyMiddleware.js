var applyMiddleware = function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function (set, get, config) {
    return middlewares.reduceRight(function (prev, curr) {
      return curr(prev, get, config);
    }, set);
  };
};

export { applyMiddleware };
