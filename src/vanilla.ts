type Listener = () => void;
type Setter<T> = (newValue: T | ((value: T) => T)) => void;
type ActionCreator<T, A> = ((set: Setter<T>, get: () => T) => A) | undefined;

interface Reactish<T> {
  get: () => T;
  subscribe: (listener: Listener) => () => void;
}

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

type ReactishArray = Reactish<unknown>[];
type ReactishValueArray<R extends ReactishArray> = {
  [index in keyof R]: ReturnType<R[index]['get']>;
};
type SelectorFunc<R extends ReactishArray, T> = (...args: ReactishValueArray<R>) => T;

const isEqual = (args1: unknown[], args2: unknown[]) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};

const selector = <R extends ReactishArray, T>(...items: [...R, SelectorFunc<R, T>]) => {
  const lastIndex = items.length - 1;
  const selectorFunc = items[lastIndex] as SelectorFunc<R, T>;
  items.length = lastIndex;
  let cache: { args: unknown[]; ret: T } | undefined;

  return {
    get: () => {
      const args = (items as ReactishArray).map((item) => item.get()) as ReactishValueArray<R>;
      if (cache && isEqual(args, cache.args)) return cache.ret;
      const ret = selectorFunc(...args);
      cache = { args, ret };
      return ret;
    },
    subscribe: (listener: Listener) => {
      const unsubscribers = (items as ReactishArray).map((item) => item.subscribe(listener));
      return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
  };
};

export { Reactish, state, selector };
