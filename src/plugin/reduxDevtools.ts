import type {} from '@redux-devtools/extension';
import type { Plugin, Metadata } from '../types';

const reduxDevtools = <TSelectorMeta extends Metadata>({ name }: { name?: string } = {}):
  | Plugin<TSelectorMeta>
  | undefined => {
  let devtoolsExt: Window['__REDUX_DEVTOOLS_EXTENSION__'];
  if (
    process.env.NODE_ENV === 'production' ||
    typeof window === 'undefined' ||
    !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)
  )
    return;

  const devtools = devtoolsExt.connect({ name });
  const mergedState: { [index: string]: unknown } = {};

  return ({ get, subscribe, meta }) => {
    const key = meta()?.key;
    if (process.env.NODE_ENV !== 'production' && !key)
      throw new Error(
        '[reactish-state] selector should be provided with a string `key` in the config object when the `reduxDevtools` plugin is used.'
      );

    const updateState = () => {
      mergedState[key] = get();
      devtools.init(mergedState);
    };

    updateState();
    subscribe(updateState);
  };
};

export { reduxDevtools };
