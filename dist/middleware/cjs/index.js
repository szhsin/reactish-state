'use strict';

var immer$1 = require('immer');

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

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

var immer = function immer(_ref) {
  var set = _ref.set;
  return function (value) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    return set.apply(void 0, [typeof value === 'function' ? immer$1.produce(value) : value].concat(rest));
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
  var middleware = function middleware(_ref2, config) {
    var set = _ref2.set,
      get = _ref2.get;
    var key = (config == null ? void 0 : config.key) || '';
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `persist` middleware is used.');
    if (prefix) key = prefix + key;
    states.push([key, set]);
    return function () {
      set.apply(void 0, arguments);
      getStorage().setItem(key, JSON.stringify(get()));
    };
  };
  middleware.hydrate = function () {
    states.forEach(function (_ref3) {
      var key = _ref3[0],
        set = _ref3[1];
      var value = getStorage().getItem(key);
      value && set(JSON.parse(value), 'HYDRATE');
    });
    states.length = 0;
  };
  return middleware;
};

var reduxDevtools = function reduxDevtools(_ref, config) {
  var set = _ref.set,
    get = _ref.get;
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: config == null ? void 0 : config.key
  });
  devtools.init(get());
  return function (value, action) {
    set.apply(null, arguments);
    devtools.send(typeof action === 'string' ? {
      type: action
    } : action || {
      type: 'SET',
      value: value
    }, get());
  };
};

exports.applyMiddleware = applyMiddleware;
exports.immer = immer;
exports.persist = persist;
exports.reduxDevtools = reduxDevtools;
