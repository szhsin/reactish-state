import type { Middleware, Config } from '../types';
type ReduxDevtools = (options?: {
    name?: string;
}) => Middleware<Config> | undefined;
declare const reduxDevtools: ReduxDevtools;
export type { ReduxDevtools };
export { reduxDevtools };
