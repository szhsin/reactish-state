'use strict';

var shim = require('use-sync-external-store/shim');

var createState = function createState(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    middleware = _ref.middleware;
  return function (initialValue, actionCreator, config) {
    var value = initialValue;
    var listeners = new Set();
    var get = function get() {
      return value;
    };
    var set = function set(newValue) {
      var nextValue = typeof newValue === 'function' ? newValue(value) : newValue;
      if (!Object.is(value, nextValue)) {
        value = nextValue;
        listeners.forEach(function (listener) {
          return listener();
        });
      }
    };
    var subscribe = function subscribe(listener) {
      listeners.add(listener);
      return function () {
        return listeners["delete"](listener);
      };
    };
    if (middleware) set = middleware({
      set: set,
      get: get,
      subscribe: subscribe
    }, config);
    return {
      get: get,
      set: set,
      subscribe: subscribe,
      actions: actionCreator && actionCreator(set, get)
    };
  };
};
var state = /*#__PURE__*/createState();

var isEqual = function isEqual(args1, args2) {
  for (var i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};
var createSelector = function createSelector(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    plugin = _ref.plugin;
  return function () {
    for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
      items[_key] = arguments[_key];
    }
    var length = items.length;
    var cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    var selectorFunc = items[cutoff];
    var config = items[cutoff + 1];
    items.length = cutoff;
    var cache;
    var selector = {
      get: function get() {
        var args = items.map(function (item) {
          return item.get();
        });
        if (cache && isEqual(args, cache.args)) return cache.ret;
        var ret = selectorFunc.apply(void 0, args);
        cache = {
          args: args,
          ret: ret
        };
        return ret;
      },
      subscribe: function subscribe(listener) {
        var unsubscribers = items.map(function (item) {
          return item.subscribe(listener);
        });
        return function () {
          return unsubscribers.forEach(function (unsubscribe) {
            return unsubscribe();
          });
        };
      }
    };
    plugin == null ? void 0 : plugin(selector, config);
    return selector;
  };
};
var selector = /*#__PURE__*/createSelector();

var useSnapshot = function useSnapshot(_ref) {
  var subscribe = _ref.subscribe,
    get = _ref.get;
  return shim.useSyncExternalStore(subscribe, get, get);
};

exports.createSelector = createSelector;
exports.createState = createState;
exports.selector = selector;
exports.state = state;
exports.useSnapshot = useSnapshot;
