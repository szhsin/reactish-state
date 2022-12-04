import type { Enhancer } from '../common';
declare const applyMiddleware: <T>(...middlewares: Enhancer<T>[]) => Enhancer<T>;
export { applyMiddleware };
