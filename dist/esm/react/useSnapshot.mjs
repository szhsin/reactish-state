import { useSyncExternalStore } from './shim.mjs';

const useSnapshot = ({
  subscribe,
  get
}) => useSyncExternalStore(subscribe, get, get);

export { useSnapshot };
