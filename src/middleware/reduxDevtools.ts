import type {} from '@redux-devtools/extension';
import type { Middleware } from '../common';

const reduxDevtools: Middleware = (set, get, config) => {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;

  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: (config as unknown as { key?: string } | undefined)?.key
  });
  devtools.init(get());

  return (vaule) => {
    set(vaule);
    devtools.send({ type: 'SET_STATE' }, get());
  };
};

export { reduxDevtools };
