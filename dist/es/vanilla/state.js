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
          listener();
        });
      }
    };
    if (middleware) set = middleware(set, get, config);
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
};
var state = /*#__PURE__*/createState();

export { createState, state };
