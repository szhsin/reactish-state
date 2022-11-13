import type { Reactish } from '../vanilla/common';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

const useSnapshot = <T>(state: Reactish<T>) =>
  useSyncExternalStore<T>(state.subscribe, state.get, state.get);

export { useSnapshot };
