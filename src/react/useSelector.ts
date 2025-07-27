import { useState } from 'react';
import type { SelectorSubscriber, SelectorArray, SelectorFunc, SelectorParams } from '../common';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';
import { useSnapshot } from './useSnapshot';

const useSelector = <TArray extends SelectorArray, T>(
  selectorParamFactory: () => SelectorParams<TArray, T>,
  deps?: unknown[]
) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff] as SelectorFunc<TArray, T>;
  items.length = cutoff;

  const [context] = useState<{ cache?: { args: unknown[]; val: T }; sub: SelectorSubscriber }>(
    () => ({
      sub: createSubscriber(items as SelectorArray)
    })
  );

  const get = () => {
    const { cache } = context;
    const selectorValues = getSelectorValues<TArray>(items as SelectorArray);
    const args = selectorValues.concat(deps || selectorFunc);
    if (cache && isEqual(args, cache.args)) return cache.val;
    const val = selectorFunc(...selectorValues);
    context.cache = { args, val };
    return val;
  };

  return useSnapshot({ get, subscribe: context.sub });
};

export { useSelector };
