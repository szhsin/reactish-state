import type { Middleware, Setter, Metadata } from '../types';

interface Persist<TStateMeta extends Metadata> {
  middleware: Middleware<TStateMeta>;
  hydrate: () => void;
}

const persist = <TStateMeta extends Metadata>({
  prefix,
  getStorage = () => localStorage
}: {
  prefix?: string;
  getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
} = {}): Persist<TStateMeta> => {
  const states: [string, Setter<unknown>][] = [];

  return {
    middleware: ({ set, get, meta }) => {
      let key = meta()?.key;
      if (process.env.NODE_ENV !== 'production' && !key)
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
    },

    hydrate: () => {
      states.forEach(([key, set]) => {
        try {
          const value = getStorage().getItem(key);
          if (value != null) {
            set(value !== 'undefined' ? JSON.parse(value) : undefined, `HYDRATE_${key}`);
          }
        } catch {
          /* continue regardless of error */
        }
      });
      states.length = 0;
    }
  };
};

export type { Persist };
export { persist };
