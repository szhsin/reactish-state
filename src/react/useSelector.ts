import { useState } from 'react';
import type { Subscriber, ReactishArray, SelectorFunc, SelectorParams } from '../common';
import { isEqual, createSubscriber, getReactishValues } from '../utils';
import { useSnapshot } from './useSnapshot';

const useSelector = <RA extends ReactishArray, T>(
  selectorParamFactory: () => SelectorParams<RA, T>,
  deps?: unknown[]
) => {
  const items = selectorParamFactory();
  const cutoff = items.length - 1;
  const selectorFunc = items[cutoff] as SelectorFunc<RA, T>;
  items.length = cutoff;

  const [context] = useState<{ cache?: { args: unknown[]; val: T }; sub: Subscriber }>(() => ({
    sub: createSubscriber(items as ReactishArray)
  }));

  const get = () => {
    const { cache } = context;
    const reactishValues = getReactishValues<RA>(items as ReactishArray);
    const args = reactishValues.concat(deps || selectorFunc);
    if (cache && isEqual(args, cache.args)) return cache.val;
    const val = selectorFunc(...reactishValues);
    context.cache = { args, val };
    return val;
  };

  return useSnapshot({ get, subscribe: context.sub });
};

export { useSelector };
