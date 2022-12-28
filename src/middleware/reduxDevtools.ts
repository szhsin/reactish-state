import type {} from '@redux-devtools/extension';
import type { Middleware } from '../common';

type ReduxDevtools = (options?: { name?: string }) => Middleware;

const reduxDevtools: ReduxDevtools = ({ name } = {}) => {
  let devtoolsExt: Window['__REDUX_DEVTOOLS_EXTENSION__'];
  if (typeof window === 'undefined' || !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__))
    return ({ set }) => set;

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

    return function (value, action) {
      set.apply(null, arguments as unknown as Parameters<typeof set>);
      mergedState[key] = get();
      devtools.send(
        typeof action === 'string' ? { type: action } : action || { type: `SET_${key}`, value },
        mergedState
      );
    };
  };
};

export { reduxDevtools };
