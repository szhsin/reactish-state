import type { Middleware } from '../common';

const applyMiddleware: (
  middlewares: (Middleware | undefined)[],
  options?: { fromRight?: boolean }
) => Middleware =
  (middlewares, { fromRight } = {}) =>
  (api, config) =>
    middlewares[fromRight ? 'reduceRight' : 'reduce'](
      (set, middleware) => (middleware ? middleware({ ...api, set }, config) : set),
      api.set
    );

export { applyMiddleware };
