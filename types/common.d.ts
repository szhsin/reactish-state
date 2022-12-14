export declare type Getter<T> = () => T;
export declare type Setter<T> = (newValue: T | ((value: T) => T)) => void;
export declare type Listener = () => void;
export interface Reactish<T> {
    get: Getter<T>;
    subscribe: (listener: Listener) => () => void;
}
export interface Middleware {
    <T, X>(set: Setter<T>, get: Getter<T>, config?: X): Setter<T>;
}
