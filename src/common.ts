export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((value: T) => T), context?: unknown) => void;
export type Unsubscriber = () => void;

export type StateListener<T> = (nextValue: T, prevValue: T) => void;
export type StateSubscriber<T> = (listener: StateListener<T>) => Unsubscriber;
export interface State<T> {
  get: Getter<T>;
  set: Setter<T>;
  subscribe: StateSubscriber<T>;
}
export type ActionBuilder<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
export type StateWithAction<T, A> = Omit<A, keyof State<T>> & State<T>;

export type SelectorListener = () => void;
export type SelectorSubscriber = (listener: SelectorListener) => Unsubscriber;
export interface Selector<T> {
  get: Getter<T>;
  subscribe: SelectorSubscriber;
}

export interface Config {
  key?: string;
}

export interface Middleware {
  <T>(state: State<T>, config?: Config): Setter<T>;
}

export interface Plugin {
  <T>(selector: Selector<T>, config?: Config): void;
}

export type SelectorArray = Selector<unknown>[];

export type SelectorValueArray<TArray extends SelectorArray> = {
  [index in keyof TArray]: ReturnType<TArray[index]['get']>;
};

export type SelectorFunc<TArray extends SelectorArray, T> = (
  ...args: SelectorValueArray<TArray>
) => T;

export type SelectorParams<TArray extends SelectorArray, T> = [...TArray, SelectorFunc<TArray, T>];

export interface SelectorBuilder {
  <RA extends SelectorArray, T>(...items: SelectorParams<RA, T>): Selector<T>;
  <RA extends SelectorArray, T>(...items: [...SelectorParams<RA, T>, Config]): Selector<T>;
}
