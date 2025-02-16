import type { Reactish } from '../common';
import { useSyncExternalStore } from './shim';

const useSnapshot = <T>({ subscribe, get }: Reactish<T>) =>
  useSyncExternalStore<T>(subscribe, get, get);

export { useSnapshot };
