import { useState } from 'react';
import type {
  Subscriber,
  ReactishArray,
  ReactishValueArray,
  SelectorFunc,
  SelectorParams
} from '../common';
import { isEqual } from '../utils';
import { useSnapshot } from './useSnapshot';

const useSelector = <RA extends ReactishArray, T>(
  selectorParamFactory: () => SelectorParams<RA, T>,
  deps?: unknown[]
) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff] as SelectorFunc<RA, T>;
  items.length = cutoff;

  const [context] = useState<{ cache?: { args: unknown[]; ret: T }; sub: Subscriber }>(() => ({
    sub: (listener) => {
      const unsubscribers = (items as ReactishArray).map((item) => item.subscribe(listener));
      return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
  }));

  const selector = {
    get: () => {
      const { cache } = context;
      const reactishValues = (items as ReactishArray).map((item) =>
        item.get()
      ) as ReactishValueArray<RA>;

      const args = reactishValues.concat(deps || selectorFunc);
      if (cache && isEqual(args, cache.args)) return cache.ret;
      const ret = selectorFunc(...reactishValues);
      context.cache = { args, ret };
      return ret;
    },
    subscribe: context.sub
  };

  return useSnapshot(selector);
};

export { useSelector };
