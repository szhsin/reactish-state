import type { Observable } from '../types';
declare const useSnapshot: <TValue>({ subscribe, get }: Observable<TValue>) => TValue;
export { useSnapshot };
