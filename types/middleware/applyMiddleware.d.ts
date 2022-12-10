import type { Middleware } from '../common';
declare const applyMiddleware: (...middlewares: Middleware[]) => Middleware;
export { applyMiddleware };
