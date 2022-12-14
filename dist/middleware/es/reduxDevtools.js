var reduxDevtools = function reduxDevtools(set, get, context) {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: context == null ? void 0 : context.key
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
