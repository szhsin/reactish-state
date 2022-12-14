var reduxDevtools = function reduxDevtools(set, get, config) {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: config == null ? void 0 : config.key
  });
  devtools.init(get());
  return function (vaule) {
    set(vaule);
    devtools.send({
      type: 'SET_STATE'
    }, get());
  };
};

export { reduxDevtools };
