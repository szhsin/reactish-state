type Listener = () => void;
type Setter<T> = (newValue: T | ((value: T) => T)) => void;
type ActionCreator<T, A> = (set: Setter<T>, get: () => T) => A;

interface State<T, A = unknown> {
  get: () => T;
  set: Setter<T>;
  subscribe: (listener: Listener) => () => void;
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

export { state, State };
