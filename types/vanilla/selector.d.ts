import type { Reactish, Listener } from '../common';
declare type ReactishArray = Reactish<unknown>[];
declare type ReactishValueArray<R extends ReactishArray> = {
    [index in keyof R]: ReturnType<R[index]['get']>;
};
declare type SelectorFunc<R extends ReactishArray, T> = (...args: ReactishValueArray<R>) => T;
declare const selector: <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>]) => {
    get: () => T;
    subscribe: (listener: Listener) => () => void;
};
export { selector };
