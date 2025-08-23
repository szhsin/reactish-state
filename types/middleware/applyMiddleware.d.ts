import type { Middleware } from '../types';
declare const applyMiddleware: <TConfig>(middlewares: (Middleware<TConfig> | undefined)[], options?: {
    fromRight?: boolean;
}) => Middleware<TConfig>;
export { applyMiddleware };
