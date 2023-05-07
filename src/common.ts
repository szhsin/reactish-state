export type Getter<T> = () => T;
export type Setter<T> = (
  newValue: T | ((value: T) => T),
  action?: string | { type: string; [key: string]: unknown }
) => void;
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
  <T>(api: Reactish<T> & { set: Setter<T> }, config?: Config): Setter<T>;
}

export interface Plugin {
  <T>(reactish: Reactish<T>, config?: Config): void;
}

export type ReactishArray = Reactish<unknown>[];

export type ReactishValueArray<RA extends ReactishArray> = {
  [index in keyof RA]: ReturnType<RA[index]['get']>;
};

export type SelectorFunc<RA extends ReactishArray, T> = (...args: ReactishValueArray<RA>) => T;

export type SelectorParams<RA extends ReactishArray, T> = [...RA, SelectorFunc<RA, T>];

export interface Selector {
  <RA extends ReactishArray, T>(...items: SelectorParams<RA, T>): Reactish<T>;
  <RA extends ReactishArray, T>(...items: [...SelectorParams<RA, T>, Config]): Reactish<T>;
}
