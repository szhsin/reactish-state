import type { StateBuilder, StateBuilderWithMeta, Middleware } from '../types';
declare const stateBuilder: <TStateMeta = never>(middleware?: Middleware<TStateMeta>) => [TStateMeta] extends [never] ? StateBuilder : StateBuilderWithMeta<TStateMeta>;
declare const state: StateBuilder;
export { state, stateBuilder };
