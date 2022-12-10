var applyMiddleware = function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function (set, get, context) {
    middlewares.forEach(function (middleware) {
      return set = middleware(set, get, context);
    });
    return set;
  };
};

export { applyMiddleware };
