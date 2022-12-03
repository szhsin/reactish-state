export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((value: T) => T)) => void;
export type Listener = () => void;

export interface Reactish<T> {
  get: Getter<T>;
  subscribe: (listener: Listener) => () => void;
}

export type Enhancer<T> = (set: Setter<T>, get: Getter<T>) => Setter<T>;
