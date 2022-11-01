declare type Listener = () => void;
declare const state: <T>(initialValue: T) => {
    get: () => T;
    set: (newValue: T) => void;
    subscribe: (listener: Listener) => () => void;
};
export { state };
