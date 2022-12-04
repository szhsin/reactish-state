import type { Enhancer } from '../common';
const applyMiddleware: <T>(...middlewares: Enhancer<T>[]) => Enhancer<T> =
  (...middlewares) =>
  (set, get) => {
    middlewares.forEach((middleware) => (set = middleware(set, get)));
    return set;
  };

export { applyMiddleware };
