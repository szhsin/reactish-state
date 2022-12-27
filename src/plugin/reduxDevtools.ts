import type {} from '@redux-devtools/extension';
import type { Plugin } from '../common';

const reduxDevtools: Plugin = ({ get, subscribe }, config) => {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return;

  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name: config?.key });
  devtools.init(get());
  subscribe(() => devtools.init(get()));
};

export { reduxDevtools };
