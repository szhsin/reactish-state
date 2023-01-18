import type { Middleware } from '../common';
type ReduxDevtools = (options?: {
    name?: string;
}) => Middleware | undefined;
declare const reduxDevtools: ReduxDevtools;
export type { ReduxDevtools };
export { reduxDevtools };
