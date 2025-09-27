import type { Plugin, Metadata } from '../types';
declare const reduxDevtools: <TSelectorMeta extends Metadata>({ name }?: {
    name?: string;
}) => Plugin<TSelectorMeta> | undefined;
export { reduxDevtools };
