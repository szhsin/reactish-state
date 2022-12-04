import type { Setter, Reactish, Enhancer } from '../common';
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare type StateCreator = <T, A, X>(initialValue: T, actionCreator?: ActionCreator<T, A>, context?: X) => State<T, A, ActionCreator<T, A>>;
declare const createState: <T, X>({ enhancer }?: {
    enhancer?: Enhancer<T, X> | undefined;
}) => <A>(initialValue: T, actionCreator?: ActionCreator<T, A>, context?: X | undefined) => State<T, A, ActionCreator<T, A>>;
declare const state: StateCreator;
export type { StateCreator };
export { state, createState };
