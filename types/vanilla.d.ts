declare type Listener = () => void;
declare type Setter<T> = (newValue: T | ((value: T) => T)) => void;
declare type ActionCreator<T, A> = (set: Setter<T>, get: () => T) => A;
interface Reactish<T> {
    get: () => T;
    subscribe: (listener: Listener) => () => void;
}
interface State<T, A = unknown> extends Reactish<T> {
    set: Setter<T>;
    actions?: A;
}
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A>;
declare type ReactishArray = Reactish<unknown>[];
declare type ReactishValueArray<R extends ReactishArray> = {
    [index in keyof R]: ReturnType<R[index]['get']>;
};
declare type SelectorFunc<R extends ReactishArray, V> = (...args: ReactishValueArray<R>) => V;
declare const selector: <R extends ReactishArray, V>(...items: [...R, SelectorFunc<R, V>]) => {
    get: () => V;
    subscribe: (listener: Listener) => () => void;
};
export { Reactish, state, selector };
