import type { Middleware, Metadata } from '../types';

const reduxDevtools = <TStateMeta extends Metadata>({ name }: { name?: string } = {}):
  | Middleware<TStateMeta>
  | undefined => {
  let devtoolsExt: Window['__REDUX_DEVTOOLS_EXTENSION__'];
  if (
    process.env.NODE_ENV === 'production' ||
    typeof window === 'undefined' ||
    !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)
  ) {
    return;
  }

  const devtools = devtoolsExt.connect({ name });
  const mergedState: { [index: string]: unknown } = {};

  return ({ set, get, meta }) => {
    const key = meta()?.key;
    if (process.env.NODE_ENV !== 'production' && !key)
      throw new Error(
        '[reactish-state] state should be provided with a string `key` in the config object when the `reduxDevtools` middleware is used.'
      );
    mergedState[key] = get();
    devtools.init(mergedState);

    return (value, action) => {
      set(value, action);
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

export { reduxDevtools };
