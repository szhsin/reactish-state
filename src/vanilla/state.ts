import type {
  ActionBuilder,
  StateBuilder,
  StateListener,
  StateSubscriber,
  Middleware
} from '../types';

const createState = <TConfig>({ middleware }: { middleware?: Middleware<TConfig> } = {}) =>
  (<TValue, TAction, TContext>(
    initialValue: TValue,
    actionBuilder?: ActionBuilder<TValue, TAction, TContext>,
    config?: TConfig
  ) => {
    type SetterFunction = (prev: TValue) => TValue;
    let value = initialValue;
    const listeners = new Set<StateListener<TValue>>();

    const get = () => value;
    let set = (newValue: TValue | SetterFunction) => {
      const nextValue =
        typeof newValue === 'function' ? (newValue as SetterFunction)(value) : newValue;
      if (!Object.is(value, nextValue)) {
        const prevValue = value;
        value = nextValue;
        listeners.forEach((listener) => listener(nextValue, prevValue));
      }
    };
    const subscribe: StateSubscriber<TValue> = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    if (middleware) set = middleware({ set, get, subscribe }, config);

    return {
      ...actionBuilder?.(set, get),
      get,
      set,
      subscribe
    };
  }) as StateBuilder<TConfig>;

const state = createState();

export { state, createState };
