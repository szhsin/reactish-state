import type { Selector } from '../common';
declare const useSnapshot: <T>({ subscribe, get }: Selector<T>) => T;
export { useSnapshot };
