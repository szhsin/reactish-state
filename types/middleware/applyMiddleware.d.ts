import type { Middleware } from '../common';
declare const applyMiddleware: (middlewares: Middleware[], options?: {
    fromRight?: boolean;
}) => Middleware;
export { applyMiddleware };
