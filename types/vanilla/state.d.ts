import type { StateBuilder, Middleware } from '../types';
declare const createState: <TConfig>({ middleware }?: {
    middleware?: Middleware<TConfig>;
}) => StateBuilder<TConfig>;
declare const state: StateBuilder<unknown>;
export { state, createState };
