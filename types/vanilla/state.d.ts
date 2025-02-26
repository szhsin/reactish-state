import type { Reactish, Setter, Config, Middleware } from '../common';
type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
type VanillaState<T> = Reactish<T> & {
    set: Setter<T>;
};
type State<T, A> = Omit<A, keyof VanillaState<T>> & VanillaState<T>;
declare const createState: ({ middleware }?: {
    middleware?: Middleware;
}) => <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => State<T, A>;
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => State<T, A>;
export type { State, ActionCreator };
export { state, createState };
