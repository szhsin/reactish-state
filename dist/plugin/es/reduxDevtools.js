var reduxDevtools = function reduxDevtools(_ref, config) {
  var get = _ref.get,
    subscribe = _ref.subscribe;
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: config == null ? void 0 : config.key
  });
  devtools.init(get());
  subscribe(function () {
    return devtools.init(get());
  });
};

export { reduxDevtools };
