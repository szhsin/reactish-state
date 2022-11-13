var isEqual = function isEqual(args1, args2) {
  for (var i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};
var selector = function selector() {
  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }
  var lastIndex = items.length - 1;
  var selectorFunc = items[lastIndex];
  items.length = lastIndex;
  var cache;
  return {
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
};

export { selector };
