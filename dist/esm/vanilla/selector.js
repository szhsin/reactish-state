const isEqual = (args1, args2) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};
const createSelector = ({
  plugin
} = {}) => (...items) => {
  const {
    length
  } = items;
  const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
  const selectorFunc = items[cutoff];
  const config = items[cutoff + 1];
  items.length = cutoff;
  let cache;
  const selector = {
    get: () => {
      const args = items.map(item => item.get());
      if (cache && isEqual(args, cache.args)) return cache.ret;
      const ret = selectorFunc(...args);
      cache = {
        args,
        ret
      };
      return ret;
    },
    subscribe: listener => {
      const unsubscribers = items.map(item => item.subscribe(listener));
      return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }
  };
  plugin == null ? void 0 : plugin(selector, config);
  return selector;
};
const selector = /*#__PURE__*/createSelector();

export { createSelector, selector };
