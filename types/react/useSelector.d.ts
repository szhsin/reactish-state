import type { ReactishArray, SelectorFunc, SelectorParams } from '../common';
declare const useSelector: <RA extends ReactishArray, T>(selectorParamFactory: () => [...RA, SelectorFunc<RA, T>], deps?: unknown[]) => T;
export { useSelector };
