export declare type Getter<T> = () => T;
export declare type Setter<T> = (newValue: T | ((value: T) => T), action?: string | {
    type: string;
    [key: string]: unknown;
}) => void;
export declare type Listener = () => void;
export declare type Subscriber = (listener: Listener) => () => void;
export interface Reactish<T> {
    get: Getter<T>;
    subscribe: Subscriber;
}
export interface Config {
    key?: string;
}
export interface Middleware {
    <T>(api: Reactish<T> & {
        set: Setter<T>;
    }, config?: Config): Setter<T>;
}
export interface Plugin {
    <T>(reactish: Reactish<T>, config?: Config): void;
}
