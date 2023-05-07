import { getReactishValues, createSubscriber, isEqual } from '../utils.js';

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
      const args = getReactishValues(items);
      if (cache && isEqual(args, cache.args)) return cache.val;
      const val = selectorFunc(...args);
      cache = {
        args,
        val
      };
      return val;
    },
    subscribe: createSubscriber(items)
  };
  plugin == null ? void 0 : plugin(selector, config);
  return selector;
};
const selector = /*#__PURE__*/createSelector();

export { createSelector, selector };
