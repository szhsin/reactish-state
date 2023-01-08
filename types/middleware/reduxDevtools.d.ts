import type { Middleware } from '../common';
declare type ReduxDevtools = (options?: {
    name?: string;
}) => Middleware | undefined;
declare const reduxDevtools: ReduxDevtools;
export { reduxDevtools };
