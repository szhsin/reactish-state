import type { Middleware } from '../common';
const applyMiddleware: (...middlewares: Middleware[]) => Middleware =
  (...middlewares) =>
  (set, get, context) => {
    middlewares.forEach((middleware) => (set = middleware(set, get, context)));
    return set;
  };

export { applyMiddleware };
