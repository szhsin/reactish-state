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

export { persist };
