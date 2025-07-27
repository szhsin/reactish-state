import { useState } from 'react';
import { createSubscriber, getSelectorValues, isEqual } from '../utils.mjs';
import { useSnapshot } from './useSnapshot.mjs';

const useSelector = (selectorParamFactory, deps) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff];
  items.length = cutoff;
  const [context] = useState(() => ({
    sub: createSubscriber(items)
  }));
  const get = () => {
    const {
      cache
    } = context;
    const selectorValues = getSelectorValues(items);
    const args = selectorValues.concat(deps || selectorFunc);
    if (cache && isEqual(args, cache.args)) return cache.val;
    const val = selectorFunc(...selectorValues);
    context.cache = {
      args,
      val
    };
    return val;
  };
  return useSnapshot({
    get,
    subscribe: context.sub
  });
};

export { useSelector };
