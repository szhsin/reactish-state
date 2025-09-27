'use strict';

var utils = require('../utils.cjs');

const createSelector = ({
  plugin
} = {}) => (...items) => {
  const length = items.length;
  const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
  const selectorFunc = items[cutoff];
  const metadata = items[cutoff + 1];
  items.length = cutoff;
  let cache;
  const selector = {
    get: () => {
      const args = utils.getSelectorValues(items);
      if (cache && utils.isEqual(args, cache[0])) return cache[1];
      const value = selectorFunc(...args);
      cache = [args, value];
      return value;
    },
    subscribe: utils.createSubscriber(items),
    meta: () => metadata
  };
  plugin?.(selector);
  return selector;
  // Wrap TSelectorMeta in a tuple to prevent conditional type distribution;
};
const selector = /*#__PURE__*/createSelector();

exports.createSelector = createSelector;
exports.selector = selector;
