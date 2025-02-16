import { useSyncExternalStore as native } from 'react';
import { useSyncExternalStore as shim } from 'use-sync-external-store/shim';
import { useSyncExternalStore, setReactShim } from '../../react/shim';
import { reactShim } from '../../shim';

test('React shim', () => {
  expect(useSyncExternalStore).toBe(native);
  setReactShim(reactShim);
  expect(useSyncExternalStore).toBe(shim);
});
