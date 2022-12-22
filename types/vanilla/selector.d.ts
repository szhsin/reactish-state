import type { Reactish, Plugin, Config } from '../common';
declare type ReactishArray = Reactish<unknown>[];
declare type ReactishValueArray<R extends ReactishArray> = {
    [index in keyof R]: ReturnType<R[index]['get']>;
};
declare type SelectorFunc<R extends ReactishArray, T> = (...args: ReactishValueArray<R>) => T;
interface Selector {
    <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>]): Reactish<T>;
    <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>, Config]): Reactish<T>;
}
declare const createSelector: ({ plugin }?: {
    plugin?: Plugin | undefined;
}) => Selector;
declare const selector: Selector;
export { selector, createSelector };
