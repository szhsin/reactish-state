import type { Middleware } from '../common';
declare type ReduxDevtools = (options?: {
    name?: string;
}) => Middleware;
declare const reduxDevtools: ReduxDevtools;
export { reduxDevtools };
