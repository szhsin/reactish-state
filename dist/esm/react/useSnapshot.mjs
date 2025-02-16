import { useSyncExternalStore } from './shim.mjs';

const useSnapshot = ({
  subscribe,
  get
}) => {
  if (process.env.NODE_ENV !== 'production' && !useSyncExternalStore) {
    throw new Error('[reactish-state] Shim setup is required for React 16/17.');
  }
  return useSyncExternalStore(subscribe, get, get);
};

export { useSnapshot };
