'use strict';

var shim = require('use-sync-external-store/shim');

var state = function state(initialValue, actionCreator) {
  var value = initialValue;
  var listeners = new Set();
  function get() {
    return value;
  }
  function set(newValue) {
    var nextValue = typeof newValue === 'function' ? newValue(value) : newValue;
    if (!Object.is(value, nextValue)) {
      value = nextValue;
      listeners.forEach(function (listener) {
        listener();
      });
    }
  }
  return {
    get: get,
    set: set,
    subscribe: function subscribe(listener) {
      listeners.add(listener);
      return function () {
        listeners["delete"](listener);
      };
    },
    actions: actionCreator && actionCreator(set, get)
  };
};
var selector = function selector() {
  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }
  var lastIndex = items.length - 1;
  var selectorFunc = items[lastIndex];
  items.length = lastIndex;
  return {
    get: function get() {
      return selectorFunc.apply(void 0, items.map(function (item) {
        return item.get();
      }));
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
};

var useSnapshot = function useSnapshot(state) {
  var value = shim.useSyncExternalStore(state.subscribe, state.get, state.get);
  return value;
};

exports.selector = selector;
exports.state = state;
exports.useSnapshot = useSnapshot;
