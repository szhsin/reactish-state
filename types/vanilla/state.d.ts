import type { Reactish } from './common';
declare type Setter<T> = (newValue: T | ((value: T) => T)) => void;
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | undefined;
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A, ActionCreator<T, A>>;
export { state };
