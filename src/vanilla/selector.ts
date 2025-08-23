import type { Plugin, SelectorArray, SelectorFunc, SelectorBuilder } from '../types';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';

const createSelector = <TConfig>({ plugin }: { plugin?: Plugin<TConfig> } = {}) =>
  (<TArray extends SelectorArray, TValue>(...items: unknown[]) => {
    const { length } = items;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<TArray, TValue>;
    const config = items[cutoff + 1] as TConfig;
    items.length = cutoff;
    let cache: { args: unknown[]; val: TValue } | undefined;

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
  }) as SelectorBuilder<TConfig>;

const selector = createSelector();

export { selector, createSelector };
