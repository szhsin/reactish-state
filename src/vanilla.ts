type Listener = () => void;

type ActionCreator<T, A> = (set: (value: T) => void, get: () => T) => A;

interface State<T, A = undefined> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: Listener) => () => void;
  actions?: A;
}

const state: <T, A>(initialValue: T, actionCreator?: ActionCreator<T, A>) => State<T, A> = (
  initialValue,
  actionCreator
) => {
  let value = initialValue;
  const listeners = new Set<Listener>();

  function get() {
    return value;
  }

  function set(newValue: typeof initialValue) {
    value = newValue;
    listeners.forEach((listener) => {
      listener();
    });
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
