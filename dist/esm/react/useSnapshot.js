import { useSyncExternalStore } from 'use-sync-external-store/shim';

const useSnapshot = ({
  subscribe,
  get
}) => useSyncExternalStore(subscribe, get, get);

export { useSnapshot };
