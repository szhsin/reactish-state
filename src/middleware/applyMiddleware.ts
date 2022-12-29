import type { Middleware } from '../common';

const applyMiddleware: (
  middlewares: Middleware[],
  options?: { fromRight?: boolean }
) => Middleware =
  (middlewares, { fromRight } = {}) =>
  (api, config) =>
    middlewares[fromRight ? 'reduceRight' : 'reduce'](
      (set, middleware) => middleware({ ...api, set }, config),
      api.set
    );

export { applyMiddleware };
