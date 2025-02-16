import { useSyncExternalStore } from 'use-sync-external-store/shim';

const reactShim = [useSyncExternalStore] as const;

export { reactShim };
