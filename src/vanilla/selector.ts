import type { Plugin, Selector, SelectorArray, SelectorFunc, SelectorBuilder } from '../types';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';

const createSelector = <TConfig>({ plugin }: { plugin?: Plugin<TConfig> } = {}) =>
  (<TArray extends SelectorArray, TValue>(...items: unknown[]) => {
    const length = items.length;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<TArray, TValue>;
    const config = items[cutoff + 1] as TConfig;
    items.length = cutoff;
    let cache: readonly [unknown[], TValue] | undefined;

    const selector: Selector<TValue> = {
      get: () => {
        const args = getSelectorValues<TArray>(items as SelectorArray);
        if (cache && isEqual(args, cache[0])) return cache[1];
        const value = selectorFunc(...args);
        cache = [args, value];
        return value;
      },
      subscribe: createSubscriber(items as SelectorArray)
    };

    plugin?.(selector, config);
    return selector;
  }) as SelectorBuilder<TConfig>;

const selector = createSelector();

export { selector, createSelector };
