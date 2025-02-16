import type { Reactish } from '../common';
import { useSyncExternalStore } from './shim';

const useSnapshot = <T>({ subscribe, get }: Reactish<T>) => {
  if (process.env.NODE_ENV !== 'production' && !useSyncExternalStore) {
    throw new Error('[reactish-state] Shim setup is required for React 16/17.');
  }
  return useSyncExternalStore<T>(subscribe, get, get);
};

export { useSnapshot };
