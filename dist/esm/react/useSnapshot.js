import { useSyncExternalStore } from 'use-sync-external-store/shim';

var useSnapshot = function useSnapshot(_ref) {
  var subscribe = _ref.subscribe,
    get = _ref.get;
  return useSyncExternalStore(subscribe, get, get);
};

export { useSnapshot };
