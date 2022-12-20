var reduxDevtools = function reduxDevtools(set, get, config) {
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

export { reduxDevtools };
