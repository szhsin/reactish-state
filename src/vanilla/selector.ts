import type {
  Listener,
  Plugin,
  Config,
  ReactishArray,
  ReactishValueArray,
  SelectorFunc,
  Selector
} from '../common';

const isEqual = (args1: unknown[], args2: unknown[]) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};

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
