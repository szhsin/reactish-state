import { stateBuilder } from '../../';
import { immer } from '../../middleware/immer';

test('immer', () => {
  const state = stateBuilder(immer);

  const listener = vi.fn();
  const container = state({ deep: { nested: { value: 1 } } });
  container.subscribe(listener);
  expect(listener).toHaveBeenCalledTimes(0);

  container.set((state) => {
    state.deep.nested.value = 2;
    return state;
  });
  expect(listener).toHaveBeenCalledTimes(1);
  expect(container.get()).toEqual({ deep: { nested: { value: 2 } } });

  container.set({ deep: { nested: { value: 3 } } });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(container.get()).toEqual({ deep: { nested: { value: 3 } } });
});
