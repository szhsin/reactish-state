declare type Listener = () => void;
declare type ActionCreator<T, A> = (set: (value: T) => void, get: () => T) => A;
interface State<T, A = undefined> {
    get: () => T;
    set: (value: T) => void;
    subscribe: (listener: Listener) => () => void;
    actions?: A;
}
declare const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A>;
export { state, State };
