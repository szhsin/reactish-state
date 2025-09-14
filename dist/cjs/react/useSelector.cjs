'use strict';

var React = require('react');
var utils = require('../utils.cjs');
var useSnapshot = require('./useSnapshot.cjs');

const useSelector = (selectorParamFactory, deps) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff];
  items.length = cutoff;
  const [context] = React.useState(() =>
  // eslint-disable-next-line no-sparse-arrays
  [, utils.createSubscriber(items)]);
  return useSnapshot.useSnapshot({
    get: () => {
      const [cache] = context;
      const selectorValues = utils.getSelectorValues(items);
      const args = selectorValues.concat(deps || selectorFunc);
      if (cache && utils.isEqual(args, cache[0])) return cache[1];
      const value = selectorFunc(...selectorValues);
      context[0] = [args, value];
      return value;
    },
    subscribe: context[1]
  });
};

exports.useSelector = useSelector;
