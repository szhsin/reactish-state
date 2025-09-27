import type { Middleware } from '../types';
declare const applyMiddleware: <TStateMeta>(middlewares: (Middleware<TStateMeta> | undefined)[], options?: {
    fromRight?: boolean;
}) => Middleware<TStateMeta>;
export { applyMiddleware };
