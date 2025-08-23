import { useState } from 'react';
import type { SelectorSubscriber, SelectorArray, SelectorFunc, SelectorParams } from '../types';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';
import { useSnapshot } from './useSnapshot';

const useSelector = <TArray extends SelectorArray, TValue>(
  selectorParamFactory: () => SelectorParams<TArray, TValue>,
  deps?: unknown[]
) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff] as SelectorFunc<TArray, TValue>;
  items.length = cutoff;

  const [context] = useState<{ cache?: { args: unknown[]; val: TValue }; sub: SelectorSubscriber }>(
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
