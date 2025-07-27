import type { Plugin, Config, SelectorArray, SelectorFunc, SelectorBuilder } from '../common';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';

const createSelector = ({ plugin }: { plugin?: Plugin } = {}) =>
  (<TArray extends SelectorArray, T>(...items: unknown[]) => {
    const { length } = items;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<TArray, T>;
    const config = items[cutoff + 1] as Config | undefined;
    items.length = cutoff;
    let cache: { args: unknown[]; val: T } | undefined;

    const selector = {
      get: () => {
        const args = getSelectorValues<TArray>(items as SelectorArray);
        if (cache && isEqual(args, cache.args)) return cache.val;
        const val = selectorFunc(...args);
        cache = { args, val };
        return val;
      },
      subscribe: createSubscriber(items as SelectorArray)
    };

    plugin?.(selector, config);
    return selector;
  }) as SelectorBuilder;

const selector = createSelector();

export { selector, createSelector };
