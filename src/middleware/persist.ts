import type { Middleware, Setter } from '../common';

interface PersistMiddleware extends Middleware {
  hydrate(): void;
}

type Persist = (options?: {
  prefix?: string;
  getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
}) => PersistMiddleware;

const persist: Persist = ({ prefix, getStorage = () => localStorage } = {}) => {
  const states: [string, Setter<unknown>][] = [];

  const middleware: PersistMiddleware = (set, get, context) => {
    let key = context ? (context as unknown as { key: string }).key : '';
    if (!key)
      throw new Error(
        '[reactish-state] state should be provided with a string `key` in the context object when the `persist` middleware is used.'
      );
    if (prefix) key = prefix + key;
    states.push([key, set as Setter<unknown>]);

    return (value) => {
      set(value);
      getStorage().setItem(key, JSON.stringify(get()));
    };
  };

  middleware.hydrate = () => {
    states.forEach(([key, set]) => {
      const value = getStorage().getItem(key);
      value && set(JSON.parse(value));
    });
    states.length = 0;
  };

  return middleware;
};

export { persist };
