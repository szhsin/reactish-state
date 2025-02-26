import type { Reactish, Setter, Listener, Subscriber, Config, Middleware } from '../common';

type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
type VanillaState<T> = Reactish<T> & { set: Setter<T> };
type State<T, A> = Omit<A, keyof VanillaState<T>> & VanillaState<T>;

const createState =
  ({ middleware }: { middleware?: Middleware } = {}) =>
  <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => {
    type F = (value: T) => T;
    let value = initialValue;
    const listeners = new Set<Listener>();

    const get = () => value;
    let set = (newValue: T | F) => {
      const nextValue = typeof newValue === 'function' ? (newValue as F)(value) : newValue;
      if (!Object.is(value, nextValue)) {
        value = nextValue;
        listeners.forEach((listener) => listener());
      }
    };
    const subscribe: Subscriber = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    if (middleware) set = middleware({ set, get, subscribe }, config);

    return {
      ...actionCreator?.(set, get),
      get,
      set,
      subscribe
    } as State<T, A>;
  };

const state = createState();

export type { State, ActionCreator };
export { state, createState };
