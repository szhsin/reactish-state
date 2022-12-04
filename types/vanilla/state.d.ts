import type { Setter, Reactish, Enhancer } from '../common';
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | undefined;
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare type StateCreator = <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A, ActionCreator<T, A>>;
declare const createState: <T, A>({ enhancer }?: {
    enhancer?: Enhancer<T> | undefined;
}) => (initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A, ActionCreator<T, A>>;
declare const state: StateCreator;
export type { StateCreator };
export { state, createState };
