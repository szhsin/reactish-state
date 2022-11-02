import { useSyncExternalStore } from 'use-sync-external-store/shim';

var useSnapshot = function useSnapshot(state) {
  var value = useSyncExternalStore(state.subscribe, state.get, state.get);
  return value;
};

export { useSnapshot };
