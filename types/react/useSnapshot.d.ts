import type { Reactish } from '../common';
declare const useSnapshot: <T>({ subscribe, get }: Reactish<T>) => T;
export { useSnapshot };
