import type { StateBuilder, StateBuilderWithMeta, Middleware } from '../types';
declare const createState: <TStateMeta = never>({ middleware }?: {
    middleware?: Middleware<TStateMeta>;
}) => [TStateMeta] extends [never] ? StateBuilder : StateBuilderWithMeta<TStateMeta>;
declare const state: StateBuilder;
export { state, createState };
