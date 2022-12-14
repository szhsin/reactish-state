import type { Setter, Reactish, Middleware } from '../common';
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare type StateCreator = <T, A, X>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: X) => State<T, A, ActionCreator<T, A>>;
declare const createState: <T, X>({ middleware }?: {
    middleware?: Middleware | undefined;
}) => <A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: X | undefined) => State<T, A, ActionCreator<T, A>>;
declare const state: StateCreator;
export type { StateCreator };
export { state, createState };
