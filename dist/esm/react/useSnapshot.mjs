import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

const useSnapshot = ({
  subscribe,
  get
}) => useSyncExternalStore(subscribe, get, get);

export { useSnapshot };
