import { useSyncExternalStore } from 'use-sync-external-store/shim';

var useSnapshot = function useSnapshot(state) {
  return useSyncExternalStore(state.subscribe, state.get, state.get);
};

export { useSnapshot };
