import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { State } from './vanilla';

const useSnapshot = <T>(state: State<T>) => {
  const value = useSyncExternalStore<T>(state.subscribe, state.get, state.get);
  return value;
};

export { useSnapshot };
