import type { SelectorArray, SelectorParams } from '../types';
declare const useSelector: <TArray extends SelectorArray, TValue>(selectorParamFactory: () => SelectorParams<TArray, TValue>, deps?: unknown[]) => TValue;
export { useSelector };
