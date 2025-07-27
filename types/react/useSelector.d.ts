import type { SelectorArray, SelectorParams } from '../common';
declare const useSelector: <TArray extends SelectorArray, T>(selectorParamFactory: () => SelectorParams<TArray, T>, deps?: unknown[]) => T;
export { useSelector };
