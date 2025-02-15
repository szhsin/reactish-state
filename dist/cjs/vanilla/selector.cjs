'use strict';

var utils = require('../utils.cjs');

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
      const args = utils.getReactishValues(items);
      if (cache && utils.isEqual(args, cache.args)) return cache.val;
      const val = selectorFunc(...args);
      cache = {
        args,
        val
      };
      return val;
    },
    subscribe: utils.createSubscriber(items)
  };
  plugin?.(selector, config);
  return selector;
};
const selector = /*#__PURE__*/createSelector();

exports.createSelector = createSelector;
exports.selector = selector;
