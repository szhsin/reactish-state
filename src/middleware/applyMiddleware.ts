import type { Middleware } from '../types';

const applyMiddleware: <TConfig>(
  middlewares: (Middleware<TConfig> | undefined)[],
  options?: { fromRight?: boolean }
) => Middleware<TConfig> =
  (middlewares, { fromRight } = {}) =>
  (api, config) =>
    middlewares[fromRight ? 'reduceRight' : 'reduce'](
      (set, middleware) => (middleware ? middleware({ ...api, set }, config) : set),
      api.set
    );

export { applyMiddleware };
