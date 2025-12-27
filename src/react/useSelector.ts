'use client';

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

  const [context] = useState<[readonly [unknown[], TValue] | undefined, SelectorSubscriber]>(() =>
    // eslint-disable-next-line no-sparse-arrays
    [, createSubscriber(items as SelectorArray)]
  );

  return useSnapshot<TValue>({
    get: () => {
      const [cache] = context;
      const selectorValues = getSelectorValues<TArray>(items as SelectorArray);
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
