import type { Plugin } from '../common';
declare type ReduxDevtools = (options?: {
    name?: string;
}) => Plugin | undefined;
declare const reduxDevtools: ReduxDevtools;
export type { ReduxDevtools };
export { reduxDevtools };
