export type Listener = () => void;

export interface Reactish<T> {
  get: () => T;
  subscribe: (listener: Listener) => () => void;
}
