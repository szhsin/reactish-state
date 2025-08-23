import type { Selector } from '../types';
import { useSyncExternalStore } from './shim';

const useSnapshot = <TValue>({ subscribe, get }: Selector<TValue>) => {
  if (process.env.NODE_ENV !== 'production' && !useSyncExternalStore) {
    throw new Error(
      '[reactish-state] Shim setup is required for React 16/17. See: https://github.com/szhsin/reactish-state/tree/master?tab=readme-ov-file#react-1617-setup'
    );
  }
  return useSyncExternalStore<TValue>(subscribe, get, get);
};

export { useSnapshot };
