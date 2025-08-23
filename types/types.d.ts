export type Getter<TValue> = () => TValue;
export type Setter<TValue, TContext = unknown> = (newValue: TValue | ((value: TValue) => TValue), context?: TContext) => void;
export type Unsubscriber = () => void;
export type StateListener<TValue> = (nextValue: TValue, prevValue: TValue) => void;
export type StateSubscriber<TValue> = (listener: StateListener<TValue>) => Unsubscriber;
export interface State<TValue, TContext = unknown> {
    get: Getter<TValue>;
    set: Setter<TValue, TContext>;
    subscribe: StateSubscriber<TValue>;
}
export type StateWithAction<TValue, TAction, TContext = unknown> = Omit<TAction, keyof State<TValue, TContext>> & State<TValue, TContext>;
export type ActionBuilder<TValue, TAction, TContext = unknown> = (set: Setter<TValue, TContext>, get: () => TValue) => TAction;
export interface StateBuilder<TConfig = unknown> {
    <TValue, TContext = unknown>(): State<TValue | undefined, TContext>;
    <TValue, TContext = unknown>(initialValue: TValue): State<TValue, TContext>;
    <TValue, TContext = unknown>(initialValue: TValue, actionBuilder: null | undefined, config?: TConfig): State<TValue, TContext>;
    <TValue, TAction, TContext = unknown>(initialValue: TValue, actionBuilder: ActionBuilder<TValue, TAction, TContext>, config?: TConfig): StateWithAction<TValue, TAction, TContext>;
}
export type SelectorListener = () => void;
export type SelectorSubscriber = (listener: SelectorListener) => Unsubscriber;
export interface Selector<TValue> {
    get: Getter<TValue>;
    subscribe: SelectorSubscriber;
}
export interface Config {
    key?: string;
}
export interface Middleware<TConfig = unknown> {
    <TValue, TContext = unknown>(state: State<TValue, TContext>, config?: TConfig): Setter<TValue, TContext>;
}
export interface Plugin<TConfig = unknown> {
    <TValue>(selector: Selector<TValue>, config?: TConfig): void;
}
export type SelectorArray = Selector<unknown>[];
export type SelectorValueArray<TArray extends SelectorArray> = {
    [index in keyof TArray]: ReturnType<TArray[index]['get']>;
};
export type SelectorFunc<TArray extends SelectorArray, TValue> = (...args: SelectorValueArray<TArray>) => TValue;
export type SelectorParams<TArray extends SelectorArray, TValue> = [
    ...TArray,
    SelectorFunc<TArray, TValue>
];
export interface SelectorBuilder<TConfig = unknown> {
    <TArray extends SelectorArray, TValue>(...items: SelectorParams<TArray, TValue>): Selector<TValue>;
    <TArray extends SelectorArray, TValue>(...items: [...SelectorParams<TArray, TValue>, TConfig]): Selector<TValue>;
}
