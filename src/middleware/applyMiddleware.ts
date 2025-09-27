import type { Middleware } from '../types';

const applyMiddleware: <TStateMeta>(
  middlewares: (Middleware<TStateMeta> | undefined)[],
  options?: { fromRight?: boolean }
) => Middleware<TStateMeta> =
  (middlewares, { fromRight } = {}) =>
  (api) =>
    middlewares[fromRight ? 'reduceRight' : 'reduce'](
      (set, middleware) => (middleware ? middleware({ ...api, set }) : set),
      api.set
    );

export { applyMiddleware };
