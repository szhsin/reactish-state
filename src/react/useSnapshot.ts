import type { Reactish } from '../common';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

const useSnapshot = <T>({ subscribe, get }: Reactish<T>) =>
  useSyncExternalStore<T>(subscribe, get, get);

export { useSnapshot };
