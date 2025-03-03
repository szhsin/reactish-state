'use strict';

var React = require('react');
var utils = require('../utils.cjs');
var useSnapshot = require('./useSnapshot.cjs');

const useSelector = (selectorParamFactory, deps) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff];
  items.length = cutoff;
  const [context] = React.useState(() => ({
    sub: utils.createSubscriber(items)
  }));
  const get = () => {
    const {
      cache
    } = context;
    const reactishValues = utils.getReactishValues(items);
    const args = reactishValues.concat(deps || selectorFunc);
    if (cache && utils.isEqual(args, cache.args)) return cache.val;
    const val = selectorFunc(...reactishValues);
    context.cache = {
      args,
      val
    };
    return val;
  };
  return useSnapshot.useSnapshot({
    get,
    subscribe: context.sub
  });
};

exports.useSelector = useSelector;
