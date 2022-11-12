declare type Listener = () => void;
declare type Setter<T> = (newValue: T | ((value: T) => T)) => void;
declare type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | undefined;
interface Reactish<T> {
    get: () => T;
    subscribe: (listener: Listener) => () => void;
}
interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
    set: Setter<T>;
    actions: C extends undefined ? never : A;
}
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A, ActionCreator<T, A>>;
declare type ReactishArray = Reactish<unknown>[];
declare type ReactishValueArray<R extends ReactishArray> = {
    [index in keyof R]: ReturnType<R[index]['get']>;
};
declare type SelectorFunc<R extends ReactishArray, T> = (...args: ReactishValueArray<R>) => T;
declare const selector: <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>]) => {
    get: () => T;
    subscribe: (listener: Listener) => () => void;
};
export { Reactish, state, selector };
