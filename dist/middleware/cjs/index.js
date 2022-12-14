'use strict';

var applyMiddleware = function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function (set, get, context) {
    return middlewares.reduceRight(function (prev, curr) {
      return curr(prev, get, context);
    }, set);
  };
};

var reduxDevtools = function reduxDevtools(set, get, context) {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: context == null ? void 0 : context.key
  });
  devtools.init(get());
  return function (vaule) {
    set(vaule);
    devtools.send({
      type: 'SET_STATE'
    }, get());
  };
};

var persist = function persist(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    prefix = _ref.prefix,
    _ref$getStorage = _ref.getStorage,
    getStorage = _ref$getStorage === void 0 ? function () {
      return localStorage;
    } : _ref$getStorage;
  var states = [];
  var middleware = function middleware(set, get, context) {
    var key = context ? context.key : '';
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the context object when the `persist` middleware is used.');
    if (prefix) key = prefix + key;
    states.push([key, set]);
    return function (value) {
      set(value);
      getStorage().setItem(key, JSON.stringify(get()));
    };
  };
  middleware.hydrate = function () {
    states.forEach(function (_ref2) {
      var key = _ref2[0],
        set = _ref2[1];
      var value = getStorage().getItem(key);
      value && set(JSON.parse(value));
    });
    states.length = 0;
  };
  return middleware;
};

exports.applyMiddleware = applyMiddleware;
exports.persist = persist;
exports.reduxDevtools = reduxDevtools;
