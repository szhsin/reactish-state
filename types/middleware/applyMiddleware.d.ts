import type { Enhancer } from '../common';
declare const applyMiddleware: <T, X>(...middlewares: Enhancer<T, X>[]) => Enhancer<T, X>;
export { applyMiddleware };
