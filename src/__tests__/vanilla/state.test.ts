import { state, createState } from '../../';

test('state should notify listeners when updated', () => {
  const listener = jest.fn();
  const secondListener = jest.fn();
  const testState = state({ count: 0 });
  const unsub = testState.subscribe(listener);
  testState.subscribe(secondListener);
  expect(testState.get()).toEqual({ count: 0 });

  testState.set((state) => ({ count: state.count + 1 }));
  expect(testState.get()).toEqual({ count: 1 });
  expect(listener).toHaveBeenCalledTimes(1);
  expect(secondListener).toHaveBeenCalledTimes(1);

  const newState = { count: 5 };
  testState.set(newState);
  expect(testState.get()).toEqual({ count: 5 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenCalledTimes(2);

  testState.set(newState);
  expect(testState.get()).toEqual({ count: 5 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenCalledTimes(2);

  unsub();
  testState.set({ count: 10 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenCalledTimes(3);
});

test('state can bind actions', () => {
  const listener = jest.fn();
  const testState = state(0, (set, get) => ({
    increase: (by = 1) => set((state) => state + by),
    decrease: (by = 1) => set(get() - by),
    reset: () => set(0)
  }));
  testState.subscribe(listener);
  expect(testState.get()).toBe(0);

  const { increase, decrease, reset } = testState.actions;
  increase();
  increase();
  expect(testState.get()).toBe(2);

  decrease(5);
  expect(testState.get()).toBe(-3);

  reset();
  expect(testState.get()).toBe(0);
  expect(listener).toHaveBeenCalledTimes(4);

  reset();
  expect(listener).toHaveBeenCalledTimes(4);
});

test('state can be enhanced with middleware', () => {
  const middleware = jest.fn();
  const state = createState({
    middleware:
      ({ set, get }, config) =>
      (...arg) => {
        set(...arg);
        middleware(get(), config?.key);
      }
  });

  const key = 'count';
  const testState = state(0, null, { key });

  testState.set(5);
  expect(testState.get()).toBe(5);
  expect(middleware).toHaveBeenLastCalledWith(5, key);

  testState.set((state) => state + 2);
  expect(testState.get()).toBe(7);
  expect(middleware).toHaveBeenLastCalledWith(7, key);

  expect(middleware).toHaveBeenCalledTimes(2);
});
