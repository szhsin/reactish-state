import { useSyncExternalStore } from './shim.mjs';

const useSnapshot = ({
  subscribe,
  get
}) => {
  if (process.env.NODE_ENV !== 'production' && !useSyncExternalStore) {
    throw new Error('[reactish-state] Shim setup is required for React 16/17. See: https://github.com/szhsin/reactish-state/tree/master?tab=readme-ov-file#react-1617-setup');
  }
  return useSyncExternalStore(subscribe, get, get);
};

export { useSnapshot };
