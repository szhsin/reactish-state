const persist = ({
  prefix,
  getStorage = () => localStorage
} = {}) => {
  const states = [];
  const middleware = ({
    set,
    get
  }, config) => {
    let key = config?.key || '';
    if (!key) throw new Error('[reactish-state] state should be provided with a string `key` in the config object when the `persist` middleware is used.');
    if (prefix) key = prefix + key;
    states.push([key, set]);
    return (...args) => {
      set(...args);
      try {
        getStorage().setItem(key, JSON.stringify(get()));
      } catch (_unused) {
        /* continue regardless of error */
      }
    };
  };
  middleware.hydrate = () => {
    states.forEach(([key, set]) => {
      try {
        const value = getStorage().getItem(key);
        value != null && set(value !== 'undefined' ? JSON.parse(value) : undefined, `HYDRATE_${key}`);
      } catch (_unused2) {
        /* continue regardless of error */
      }
    });
    states.length = 0;
  };
  return middleware;
};

export { persist };
