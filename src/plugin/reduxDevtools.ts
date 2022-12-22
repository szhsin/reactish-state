import type {} from '@redux-devtools/extension';
import type { Plugin } from '../common';

const reduxDevtools: Plugin = ({ get, subscribe }, config) => {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return;

  console.log('config?.key', config?.key);
  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name: config?.key });
  devtools.init(get());
  subscribe(() => devtools.init(get()));
};

export { reduxDevtools };
