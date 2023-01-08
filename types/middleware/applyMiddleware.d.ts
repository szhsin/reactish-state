import type { Middleware } from '../common';
declare const applyMiddleware: (middlewares: (Middleware | undefined)[], options?: {
    fromRight?: boolean;
}) => Middleware;
export { applyMiddleware };
