import type { Reactish, Setter, Config, Middleware } from '../common';
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare const createState: ({ middleware }?: {
    middleware?: Middleware | undefined;
}) => <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => State<T, A, ActionCreator<T, A>>;
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => State<T, A, ActionCreator<T, A>>;
export { state, createState };
