import type { Middleware } from '../common';

const applyMiddleware: (...middlewares: Middleware[]) => Middleware =
  (...middlewares) =>
  (set, get, config) =>
    middlewares.reduceRight((prev, curr) => curr(prev, get, config), set);

export { applyMiddleware };
