declare type Listener = () => void;
declare type Setter<T> = (newValue: T | ((value: T) => T)) => void;
declare type ActionCreator<T, A> = (set: Setter<T>, get: () => T) => A;
interface State<T, A = unknown> {
    get: () => T;
    set: Setter<T>;
    subscribe: (listener: Listener) => () => void;
    actions?: A;
}
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A>;
export { state, State };
