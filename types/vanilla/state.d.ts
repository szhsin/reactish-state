import type { State, Setter, Config, Middleware } from '../common';
type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
type StateWithAction<T, A> = Omit<A, keyof State<T>> & State<T>;
declare const createState: ({ middleware }?: {
    middleware?: Middleware;
}) => <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => StateWithAction<T, A>;
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => StateWithAction<T, A>;
export type { State, ActionCreator };
export { state, createState };
