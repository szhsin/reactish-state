'use strict';

const applyMiddleware = (middlewares, {
  fromRight
} = {}) => (api, config) => middlewares[fromRight ? 'reduceRight' : 'reduce']((set, middleware) => middleware ? middleware({
  ...api,
  set
}, config) : set, api.set);

const persist = ({
  prefix,
  getStorage = () => localStorage
} = {}) => {
  const states = [];
  const middleware = ({
    set,
    get
  }, config) => {
    let key = (config == null ? void 0 : config.key) || '';
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `persist` middleware is used.');
    if (prefix) key = prefix + key;
    states.push([key, set]);
    return (...args) => {
      set(...args);
      getStorage().setItem(key, JSON.stringify(get()));
    };
  };
  middleware.hydrate = () => {
    states.forEach(([key, set]) => {
      const value = getStorage().getItem(key);
      value != null && set(value !== 'undefined' ? JSON.parse(value) : undefined, `HYDRATE_${key}`);
    });
    states.length = 0;
  };
  return middleware;
};

const reduxDevtools = ({
  name
} = {}) => {
  let devtoolsExt;
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined' || !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)) return;
  const devtools = devtoolsExt.connect({
    name
  });
  const mergedState = {};
  return ({
    set,
    get
  }, config) => {
    const key = config == null ? void 0 : config.key;
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` middleware is used.');
    mergedState[key] = get();
    devtools.init(mergedState);
    return function (value, action) {
      set.apply(null, arguments);
      mergedState[key] = get();
      devtools.send(typeof action === 'string' ? {
        type: action
      } : action || {
        type: `SET_${key}`,
        value
      }, mergedState);
    };
  };
};

exports.applyMiddleware = applyMiddleware;
exports.persist = persist;
exports.reduxDevtools = reduxDevtools;
