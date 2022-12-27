import type { Middleware } from '../common';

const applyMiddleware: (...middlewares: Middleware[]) => Middleware =
  (...middlewares) =>
  (api, config) =>
    middlewares.reduceRight((set, middleware) => middleware({ ...api, set }, config), api.set);

export { applyMiddleware };
