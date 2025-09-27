import type { Middleware, Metadata } from '../types';
declare const reduxDevtools: <TStateMeta extends Metadata>({ name }?: {
    name?: string;
}) => Middleware<TStateMeta> | undefined;
export { reduxDevtools };
