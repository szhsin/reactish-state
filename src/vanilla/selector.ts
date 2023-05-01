import type {
  Listener,
  Plugin,
  Config,
  ReactishArray,
  ReactishValueArray,
  SelectorFunc,
  Selector
} from '../common';
import { isEqual } from '../utils';

const createSelector = ({ plugin }: { plugin?: Plugin } = {}) =>
  (<RA extends ReactishArray, T>(...items: unknown[]) => {
    const { length } = items;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<RA, T>;
    const config = items[cutoff + 1] as Config | undefined;
    items.length = cutoff;
    let cache: { args: unknown[]; ret: T } | undefined;

    const selector = {
      get: () => {
        const args = (items as ReactishArray).map((item) => item.get()) as ReactishValueArray<RA>;
        if (cache && isEqual(args, cache.args)) return cache.ret;
        const ret = selectorFunc(...args);
        cache = { args, ret };
        return ret;
      },
      subscribe: (listener: Listener) => {
        const unsubscribers = (items as ReactishArray).map((item) => item.subscribe(listener));
        return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
      }
    };

    plugin?.(selector, config);
    return selector;
  }) as Selector;

const selector = createSelector();

export type { Selector };
export { selector, createSelector };
