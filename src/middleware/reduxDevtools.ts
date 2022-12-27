import type {} from '@redux-devtools/extension';
import type { Middleware } from '../common';

type ReduxDevtools = (options?: { name?: string; merging?: boolean }) => Middleware;

const reduxDevtools: ReduxDevtools = ({ name, merging } = {}) => {
  let devtoolsExt: Window['__REDUX_DEVTOOLS_EXTENSION__'];
  if (typeof window === 'undefined' || !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__))
    return ({ set }) => set;

  let devtools: ReturnType<typeof devtoolsExt['connect']>;
  if (merging) devtools = devtoolsExt.connect({ name });
  const mergedState: { [index: string]: unknown } = {};

  return ({ set, get }, config) => {
    const key = config?.key;
    if (merging) {
      if (!key)
        throw new Error(
          '[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` middleware enables the `merging` option.'
        );
      mergedState[key] = get();
      devtools.init(mergedState);
    } else {
      devtools = devtoolsExt!.connect({ name: key });
      devtools.init(get());
    }

    return function (value, action) {
      set.apply(null, arguments as unknown as Parameters<typeof set>);
      devtools.send(
        typeof action === 'string'
          ? { type: action }
          : action || { type: merging ? `SET_${key}` : 'SET', value },
        merging ? ((mergedState[key!] = get()), mergedState) : get()
      );
    };
  };
};

export { reduxDevtools };
