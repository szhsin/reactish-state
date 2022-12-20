import type {} from '@redux-devtools/extension';
import type { Middleware } from '../common';

const reduxDevtools: Middleware = (set, get, config) => {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return set;

  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: config?.key
  });
  devtools.init(get());

  return function (_, action) {
    set.apply(null, arguments as unknown as Parameters<typeof set>);
    devtools.send(typeof action === 'string' ? { type: action } : action || { type: 'SET' }, get());
  };
};

export { reduxDevtools };
