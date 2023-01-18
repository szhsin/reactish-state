import type {} from '@redux-devtools/extension';
import type { Plugin } from '../common';

type ReduxDevtools = (options?: { name?: string }) => Plugin | undefined;

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

  return ({ get, subscribe }, config) => {
    const key = config?.key;
    if (!key)
      throw new Error(
        '[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` plugin is used.'
      );

    const updateState = () => {
      mergedState[key] = get();
      devtools.init(mergedState);
    };

    updateState();
    subscribe(updateState);
  };
};

export type { ReduxDevtools };
export { reduxDevtools };
