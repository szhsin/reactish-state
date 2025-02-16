import { state, useSnapshot } from '../../';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useSyncExternalStore: undefined
}));

test('Missing shim', () => {
  expect(() => useSnapshot(state(0))).toThrow(Error);
});
