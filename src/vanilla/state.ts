import type { Setter, Reactish, Listener, Middleware } from '../common';

type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | null | undefined;

interface State<T, A = unknown, C extends ActionCreator<T, A> = undefined> extends Reactish<T> {
  set: Setter<T>;
  actions: C extends undefined ? never : A;
}

type StateCreator = <T, A, X>(
  initialValue: T,
  actionCreator?: ActionCreator<T, A>,
  context?: X
) => State<T, A, ActionCreator<T, A>>;

const createState =
  <T, X>({ middleware }: { middleware?: Middleware } = {}) =>
  <A>(initialValue: T, actionCreator?: ActionCreator<T, A>, context?: X) => {
    type F = (value: T) => T;
    let value = initialValue;
    const listeners = new Set<Listener>();

    const get = () => value;
    let set = (newValue: T | F) => {
      const nextValue = typeof newValue === 'function' ? (newValue as F)(value) : newValue;
      if (!Object.is(value, nextValue)) {
        value = nextValue;
        listeners.forEach((listener) => {
          listener();
        });
      }
    };
    if (middleware) set = middleware(set, get, context);

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

const state: StateCreator = createState();
export type { StateCreator };
export { state, createState };
