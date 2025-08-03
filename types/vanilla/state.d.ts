import type { ActionBuilder, StateWithAction, Config, Middleware } from '../common';
declare const createState: ({ middleware }?: {
    middleware?: Middleware;
}) => <T, A>(initialValue: T, actionBuilder?: ActionBuilder<T, A>, config?: Config) => StateWithAction<T, A>;
declare const state: <T, A>(initialValue: T, actionBuilder?: ActionBuilder<T, A>, config?: Config) => StateWithAction<T, A>;
type StateBuilder = typeof state;
export { state, createState, type StateBuilder };
