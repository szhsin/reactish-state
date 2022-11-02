import { State } from './vanilla';
declare const useSnapshot: <T>(state: {
    get: () => T;
    set: (newValue: T) => void;
    subscribe: (listener: () => void) => () => void;
}) => T;
export { useSnapshot };
