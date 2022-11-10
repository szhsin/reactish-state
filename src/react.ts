import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { Reactish } from './vanilla';

const useSnapshot = <T>(state: Reactish<T>) => {
  const value = useSyncExternalStore<T>(state.subscribe, state.get, state.get);
  return value;
};

export { useSnapshot };
