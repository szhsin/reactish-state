'use strict';

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

var persist = function persist(set, get, context) {
  return function (value) {
    set(value);
    context && localStorage.setItem(context.key, JSON.stringify(get()));
  };
};

exports.applyMiddleware = applyMiddleware;
exports.persist = persist;
