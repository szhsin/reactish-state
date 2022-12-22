import type { Reactish, Listener, Plugin, Config } from '../common';

type ReactishArray = Reactish<unknown>[];
type ReactishValueArray<R extends ReactishArray> = {
  [index in keyof R]: ReturnType<R[index]['get']>;
};
type SelectorFunc<R extends ReactishArray, T> = (...args: ReactishValueArray<R>) => T;
interface Selector {
  <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>]): Reactish<T>;
  <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>, Config]): Reactish<T>;
}

const isEqual = (args1: unknown[], args2: unknown[]) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};

const createSelector = ({ plugin }: { plugin?: Plugin } = {}) =>
  (<R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>, Config?]) => {
    const lastIndex = items.length - 1;
    const selectorFunc = items[lastIndex] as SelectorFunc<R, T>;
    items.length = lastIndex;
    let cache: { args: unknown[]; ret: T } | undefined;

    const selector = {
      get: () => {
        const args = (items as ReactishArray).map((item) => item.get()) as ReactishValueArray<R>;
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

    plugin?.(selector);
    return selector;
  }) as Selector;

const selector = createSelector();

export { selector, createSelector };
