import type {
  ActionBuilder,
  StateWithAction,
  StateListener,
  StateSubscriber,
  Config,
  Middleware
} from '../common';

const createState =
  ({ middleware }: { middleware?: Middleware } = {}) =>
  <T, A>(initialValue: T, actionBuilder?: ActionBuilder<T, A>, config?: Config) => {
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
      ...actionBuilder?.(set, get),
      get,
      set,
      subscribe
    } as StateWithAction<T, A>;
  };

const state = createState();
type StateBuilder = typeof state;

export { state, createState, type StateBuilder };
