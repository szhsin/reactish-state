import type {} from '@redux-devtools/extension';
import type { Middleware, Config } from '../types';

type ReduxDevtools = (options?: { name?: string }) => Middleware<Config> | undefined;

const reduxDevtools: ReduxDevtools = ({ name } = {}) => {
  let devtoolsExt: Window['__REDUX_DEVTOOLS_EXTENSION__'];
  if (
    process.env.NODE_ENV === 'production' ||
    typeof window === 'undefined' ||
    !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)
  )
    return;

  const devtools = devtoolsExt.connect({ name });
  const mergedState: { [index: string]: unknown } = {};

  return ({ set, get }, config) => {
    const key = config?.key;
    if (!key)
      throw new Error(
        '[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` middleware is used.'
      );
    mergedState[key] = get();
    devtools.init(mergedState);

    return (...args) => {
      const [value, action] = args;
      set(...args);
      mergedState[key] = get();
      devtools.send(
        typeof action === 'string'
          ? { type: action }
          : (action as { type: string }) || { type: `SET_${key}`, value },
        mergedState
      );
    };
  };
};

export type { ReduxDevtools };
export { reduxDevtools };
