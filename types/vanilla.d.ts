declare type Listener = () => void;
declare const state: <T>(initialValue: T) => {
    get: () => T;
    set: (newValue: T) => void;
    subscribe: (listener: Listener) => () => void;
};
declare type State<T> = ReturnType<typeof state<T>>;
export { state, State };
