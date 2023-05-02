import type { Plugin, Config, ReactishArray, SelectorFunc, Selector } from '../common';
import { isEqual, createSubscriber, getReactishValues } from '../utils';

const createSelector = ({ plugin }: { plugin?: Plugin } = {}) =>
  (<RA extends ReactishArray, T>(...items: unknown[]) => {
    const { length } = items;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<RA, T>;
    const config = items[cutoff + 1] as Config | undefined;
    items.length = cutoff;
    let cache: { args: unknown[]; val: T } | undefined;

    const selector = {
      get: () => {
        const args = getReactishValues<RA>(items as ReactishArray);
        if (cache && isEqual(args, cache.args)) return cache.val;
        const val = selectorFunc(...args);
        cache = { args, val };
        return val;
      },
      subscribe: createSubscriber(items as ReactishArray)
    };

    plugin?.(selector, config);
    return selector;
  }) as Selector;

const selector = createSelector();

export type { Selector };
export { selector, createSelector };
