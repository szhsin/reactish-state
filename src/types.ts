export interface Metadata {
  key: string;
}

export type Getter<TValue> = () => TValue;

export type Setter<TValue, TContext = unknown> = (
  newValue: TValue | ((value: TValue) => TValue),
  context?: TContext
) => void;

export type Unsubscriber = () => void;

export type StateListener<TValue> = (nextValue: TValue, prevValue: TValue) => void;

export type StateSubscriber<TValue> = (listener: StateListener<TValue>) => Unsubscriber;

export interface State<TValue, TMeta = unknown, TContext = unknown> {
  get: Getter<TValue>;
  set: Setter<TValue, TContext>;
  subscribe: StateSubscriber<TValue>;
  meta: () => TMeta;
}
export type StateWithAction<TValue, TAction, TMeta = unknown, TContext = unknown> = Omit<
  TAction,
  keyof State<TValue, TMeta, TContext>
> &
  State<TValue, TMeta, TContext>;

export type ActionBuilder<TValue, TAction, TContext = unknown> = (
  set: Setter<TValue, TContext>,
  get: Getter<TValue>
) => TAction;

export interface StateBuilder {
  <TValue, TContext = unknown>(): State<TValue | undefined, undefined, TContext>;

  <TValue, TContext = unknown>(initialValue: TValue): State<TValue, undefined, TContext>;

  <TValue, TMeta, TContext = unknown>(
    initialValue: TValue,
    actionBuilder: null | undefined,
    metadata: TMeta
  ): State<TValue, TMeta, TContext>;

  <TValue, TAction, TContext = unknown>(
    initialValue: TValue,
    actionBuilder: ActionBuilder<TValue, TAction, TContext>
  ): StateWithAction<TValue, TAction, undefined, TContext>;

  <TValue, TAction, TMeta, TContext = unknown>(
    initialValue: TValue,
    actionBuilder: ActionBuilder<TValue, TAction, TContext>,
    metadata: TMeta
  ): StateWithAction<TValue, TAction, TMeta, TContext>;
}

export interface StateBuilderWithMeta<TStateMeta> {
  <TValue, TMeta extends TStateMeta, TContext = unknown>(
    initialValue: TValue,
    actionBuilder: null | undefined,
    metadata: TMeta
  ): State<TValue, TMeta, TContext>;

  <TValue, TAction, TMeta extends TStateMeta, TContext = unknown>(
    initialValue: TValue,
    actionBuilder: ActionBuilder<TValue, TAction, TContext>,
    metadata: TMeta
  ): StateWithAction<TValue, TAction, TMeta, TContext>;
}

export type SelectorListener = () => void;

export type SelectorSubscriber = (listener: SelectorListener) => Unsubscriber;

export interface Observable<TValue> {
  get: Getter<TValue>;
  subscribe: SelectorSubscriber;
}

export interface Selector<TValue, TMeta = unknown> extends Observable<TValue> {
  meta: () => TMeta;
}

export type Middleware<TStateMeta = never> = <TValue, TMeta extends TStateMeta, TContext = unknown>(
  state: State<TValue, TMeta, TContext>
) => Setter<TValue, TContext>;

export interface Plugin<TSelectorMeta = never> {
  <TValue, TMeta extends TSelectorMeta>(selector: Selector<TValue, TMeta>): void;
}

export type SelectorArray = Selector<unknown>[];

export type SelectorValueArray<TArray extends SelectorArray> = {
  [index in keyof TArray]: ReturnType<TArray[index]['get']>;
};

export type SelectorFunc<TArray extends SelectorArray, TValue> = (
  ...args: SelectorValueArray<TArray>
) => TValue;

export type SelectorParams<TArray extends SelectorArray, TValue> = [
  ...TArray,
  SelectorFunc<TArray, TValue>
];

export interface SelectorBuilder {
  <TArray extends SelectorArray, TValue>(
    ...items: SelectorParams<TArray, TValue>
  ): Selector<TValue>;

  <TArray extends SelectorArray, TValue, TMeta>(
    ...items: [...SelectorParams<TArray, TValue>, TMeta]
  ): Selector<TValue>;
}

export interface SelectorBuilderWithMeta<TSelectorMeta> {
  <TArray extends SelectorArray, TValue, TMeta extends TSelectorMeta>(
    ...items: [...SelectorParams<TArray, TValue>, TMeta]
  ): Selector<TValue>;
}
