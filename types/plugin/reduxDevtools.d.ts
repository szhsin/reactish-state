import type { Plugin, Config } from '../types';
type ReduxDevtools = (options?: {
    name?: string;
}) => Plugin<Config> | undefined;
declare const reduxDevtools: ReduxDevtools;
export type { ReduxDevtools };
export { reduxDevtools };
