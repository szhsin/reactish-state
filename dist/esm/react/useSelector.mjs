import { useState } from 'react';
import { createSubscriber, getSelectorValues, isEqual } from '../utils.mjs';
import { useSnapshot } from './useSnapshot.mjs';

const useSelector = (selectorParamFactory, deps) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff];
  items.length = cutoff;
  const [context] = useState(() =>
  // eslint-disable-next-line no-sparse-arrays
  [, createSubscriber(items)]);
  return useSnapshot({
    get: () => {
      const [cache] = context;
      const selectorValues = getSelectorValues(items);
      const args = selectorValues.concat(deps || selectorFunc);
      if (cache && isEqual(args, cache[0])) return cache[1];
      const value = selectorFunc(...selectorValues);
      context[0] = [args, value];
      return value;
    },
    subscribe: context[1]
  });
};

export { useSelector };
