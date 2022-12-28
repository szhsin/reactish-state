import type { Plugin } from '../common';
declare type ReduxDevtools = (options?: {
    name?: string;
}) => Plugin;
declare const reduxDevtools: ReduxDevtools;
export { reduxDevtools };
