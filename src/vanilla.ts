type Listener = () => void;
type Setter<T> = (newValue: T | ((value: T) => T)) => void;
type ActionCreator<T, A> = (set: Setter<T>, get: () => T) => A;

interface Reactish<T> {
  get: () => T;
  subscribe: (listener: Listener) => () => void;
}

interface State<T, A = unknown> extends Reactish<T> {
  set: Setter<T>;
  actions?: A;
}

const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A> = (
  initialValue,
  actionCreator
) => {
  type Value = typeof initialValue;
  type FValue = (value: Value) => Value;

  let value = initialValue;
  const listeners = new Set<Listener>();

  function get() {
    return value;
  }

  function set(newValue: Value | FValue) {
    const nextValue = typeof newValue === 'function' ? (newValue as FValue)(value) : newValue;
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
  };
};

type ReactishArray = Reactish<unknown>[];
type ReactishValueArray<R extends ReactishArray> = {
  [index in keyof R]: ReturnType<R[index]['get']>;
};
type SelectorFunc<R extends ReactishArray, V> = (...args: ReactishValueArray<R>) => V;

const selector = <R extends ReactishArray, V>(...items: [...R, SelectorFunc<R, V>]) => {
  const lastIndex = items.length - 1;
  const selectorFunc = items[lastIndex] as SelectorFunc<R, V>;
  items.length = lastIndex;
  return {
    get: () =>
      selectorFunc(
        ...((items as ReactishArray).map((item) => item.get()) as ReactishValueArray<R>)
      ),
    subscribe: (listener: Listener) => {
      const unsubscribers = (items as ReactishArray).map((item) => item.subscribe(listener));
      return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
  };
};

export { Reactish, state, selector };
