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
    var get = _ref2.get,
      subscribe = _ref2.subscribe;
    var key = config == null ? void 0 : config.key;
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` plugin is used.');
    var updateState = function updateState() {
      mergedState[key] = get();
      devtools.init(mergedState);
    };
    updateState();
    subscribe(updateState);
  };
};

export { reduxDevtools };
