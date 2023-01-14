'use strict';

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
      value && set(JSON.parse(value), "HYDRATE_" + key);
    });
    states.length = 0;
  };
  return middleware;
};

var reduxDevtools = function reduxDevtools(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    name = _ref.name;
  var devtoolsExt;
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined' || !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)) return;
  var devtools = devtoolsExt.connect({
    name: name
  });
  var mergedState = {};
  return function (_ref2, config) {
    var set = _ref2.set,
      get = _ref2.get;
    var key = config == null ? void 0 : config.key;
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` middleware is used.');
    mergedState[key] = get();
    devtools.init(mergedState);
    return function (value, action) {
      set.apply(null, arguments);
      mergedState[key] = get();
      devtools.send(typeof action === 'string' ? {
        type: action
      } : action || {
        type: "SET_" + key,
        value: value
      }, mergedState);
    };
  };
};

exports.applyMiddleware = applyMiddleware;
exports.persist = persist;
exports.reduxDevtools = reduxDevtools;
