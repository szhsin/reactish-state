export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((value: T) => T), action?: string | {
    type: string;
    [key: string]: unknown;
}) => void;
export type Listener = () => void;
export type Subscriber = (listener: Listener) => () => void;
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
