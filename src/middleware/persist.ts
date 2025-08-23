import type { Middleware, Setter, Config } from '../types';

interface PersistMiddleware extends Middleware<Config> {
  hydrate(this: void): void;
}

type Persist = (options?: {
  prefix?: string;
  getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
}) => PersistMiddleware;

const persist: Persist = ({ prefix, getStorage = () => localStorage } = {}) => {
  const states: [string, Setter<unknown>][] = [];

  const middleware: PersistMiddleware = ({ set, get }, config) => {
    let key = config?.key || '';
    if (!key)
      throw new Error(
        '[reactish-state] state should be provided with a string `key` in the config object when the `persist` middleware is used.'
      );
    if (prefix) key = prefix + key;
    states.push([key, set as Setter<unknown>]);

    return (...args) => {
      set(...args);
      try {
        getStorage().setItem(key, JSON.stringify(get()));
      } catch {
        /* continue regardless of error */
      }
    };
  };

  middleware.hydrate = () => {
    states.forEach(([key, set]) => {
      try {
        const value = getStorage().getItem(key);
        value != null &&
          set(value !== 'undefined' ? JSON.parse(value) : undefined, `HYDRATE_${key}`);
      } catch {
        /* continue regardless of error */
      }
    });
    states.length = 0;
  };

  return middleware;
};

export type { Persist, PersistMiddleware };
export { persist };
