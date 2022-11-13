import type { Reactish, Listener } from './common';

type Setter<T> = (newValue: T | ((value: T) => T)) => void;
type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | undefined;

interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
  set: Setter<T>;
  actions: C extends undefined ? never : A;
}

const state = <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => {
  type F = (value: T) => T;
  let value = initialValue;
  const listeners = new Set<Listener>();

  function get() {
    return value;
  }

  function set(newValue: T | F) {
    const nextValue = typeof newValue === 'function' ? (newValue as F)(value) : newValue;
    if (!Object.is(value, nextValue)) {
      value = nextValue;
      listeners.forEach((listener) => {
        listener();
      });
    }
  }

  return {
    get,
    set,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    actions: actionCreator && actionCreator(set, get)
  } as State<T, A, ActionCreator<T, A>>;
};

export { state };
