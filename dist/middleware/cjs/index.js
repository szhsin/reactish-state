'use strict';

var applyMiddleware = function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function (set, get) {
    middlewares.forEach(function (middleware) {
      return set = middleware(set, get);
    });
    return set;
  };
};

exports.applyMiddleware = applyMiddleware;
