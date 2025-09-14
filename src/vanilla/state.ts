import type {
  ActionBuilder,
  Getter,
  Setter,
  State,
  StateBuilder,
  StateListener,
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

    const get: Getter<TValue> = () => value;
    const readonlyState: Omit<State<TValue, TContext>, 'set'> = {
      get,
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
    };

    let set: Setter<TValue, TContext> = (newValue: TValue | SetterFunction) => {
      const nextValue =
        typeof newValue === 'function' ? (newValue as SetterFunction)(value) : newValue;
      if (!Object.is(value, nextValue)) {
        const prevValue = value;
        value = nextValue;
        listeners.forEach((listener) => listener(nextValue, prevValue));
      }
    };
    if (middleware) set = middleware({ ...readonlyState, set }, config);

    return {
      ...actionBuilder?.(set, get),
      ...readonlyState,
      set
    };
  }) as StateBuilder<TConfig>;

const state = createState();

export { state, createState };
