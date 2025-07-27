import type { State, Setter, StateListener, StateSubscriber, Config, Middleware } from '../common';

type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;
type StateWithAction<T, A> = Omit<A, keyof State<T>> & State<T>;

const createState =
  ({ middleware }: { middleware?: Middleware } = {}) =>
  <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>, config?: Config) => {
    type F = (value: T) => T;
    let value = initialValue;
    const listeners = new Set<StateListener<T>>();

    const get = () => value;
    let set = (newValue: T | F) => {
      const nextValue = typeof newValue === 'function' ? (newValue as F)(value) : newValue;
      if (!Object.is(value, nextValue)) {
        const prevValue = value;
        value = nextValue;
        listeners.forEach((listener) => listener(nextValue, prevValue));
      }
    };
    const subscribe: StateSubscriber<T> = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    if (middleware) set = middleware({ set, get, subscribe }, config);

    return {
      ...actionCreator?.(set, get),
      get,
      set,
      subscribe
    } as StateWithAction<T, A>;
  };

const state = createState();

export type { State, ActionCreator };
export { state, createState };
