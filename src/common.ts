export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((value: T) => T)) => void;
export type Listener = () => void;

export interface Reactish<T> {
  get: Getter<T>;
  subscribe: (listener: Listener) => () => void;
}

export interface Middleware {
  <T, X>(set: Setter<T>, get: Getter<T>, context?: X): Setter<T>;
}
