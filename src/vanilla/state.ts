import type {
  ActionBuilder,
  Getter,
  Setter,
  State,
  StateListener,
  StateBuilder,
  StateBuilderWithMeta,
  Middleware
} from '../types';

const stateBuilder = <TStateMeta = never>(middleware?: Middleware<TStateMeta>) =>
  (<TValue, TAction, TMeta extends TStateMeta, TContext>(
    initialValue: TValue,
    actionBuilder: ActionBuilder<TValue, TAction, TContext> | null | undefined,
    metadata: TMeta
  ) => {
    type SetterFunction = (prev: TValue) => TValue;
    let value = initialValue;
    const listeners = new Set<StateListener<TValue>>();

    const get: Getter<TValue> = () => value;
    const readonlyState: Omit<State<TValue, TMeta, TContext>, 'set'> = {
      get,
      meta: () => metadata,
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
    if (middleware) set = middleware({ ...readonlyState, set });

    return {
      ...actionBuilder?.(set, get),
      ...readonlyState,
      set
    };
    // Wrap TStateMeta in a tuple to prevent conditional type distribution
  }) as [TStateMeta] extends [never] ? StateBuilder : StateBuilderWithMeta<TStateMeta>;

const state = stateBuilder();

export { state, stateBuilder };
