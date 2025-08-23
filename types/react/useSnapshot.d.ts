import type { Selector } from '../types';
declare const useSnapshot: <TValue>({ subscribe, get }: Selector<TValue>) => TValue;
export { useSnapshot };
