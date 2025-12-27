import { state, useSnapshot } from '../../';

vi.mock('react', async () => {
  const originalModule = await vi.importActual<{ default: { useSyncExternalStore: unknown } }>(
    'react'
  );
  return {
    ...originalModule,
    default: { ...originalModule.default, useSyncExternalStore: undefined }
  };
});

test('Missing shim', () => {
  expect(() => useSnapshot(state(0))).toThrow('[reactish-state]');
});
