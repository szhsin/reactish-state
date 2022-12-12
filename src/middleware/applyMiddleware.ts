import type { Middleware } from '../common';

const applyMiddleware: (...middlewares: Middleware[]) => Middleware =
  (...middlewares) =>
  (set, get, context) =>
    middlewares.reduceRight((prev, curr) => curr(prev, get, context), set);

export { applyMiddleware };
