import type { Enhancer } from '../common';
const applyMiddleware: <T, X>(...middlewares: Enhancer<T, X>[]) => Enhancer<T, X> =
  (...middlewares) =>
  (set, get, context) => {
    middlewares.forEach((middleware) => (set = middleware(set, get, context)));
    return set;
  };

export { applyMiddleware };
