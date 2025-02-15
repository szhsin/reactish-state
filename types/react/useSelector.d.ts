import type { ReactishArray, SelectorParams } from '../common';
declare const useSelector: <RA extends ReactishArray, T>(selectorParamFactory: () => SelectorParams<RA, T>, deps?: unknown[]) => T;
export { useSelector };
