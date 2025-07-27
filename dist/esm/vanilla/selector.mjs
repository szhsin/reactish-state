import { createSubscriber, getSelectorValues, isEqual } from '../utils.mjs';

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
      const args = getSelectorValues(items);
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
  plugin?.(selector, config);
  return selector;
};
const selector = /*#__PURE__*/createSelector();

export { createSelector, selector };
