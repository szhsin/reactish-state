import { createState } from '../../';
import { persist } from '../../middleware';

test('persist should load and save data to storage', () => {
  const getItem = jest
    .fn<string | null, string[]>()
    .mockImplementation((key) => (key === 'cat-colour' ? '"Calico"' : null));
  const setItem = jest.fn();
  (global.localStorage as Pick<Storage, 'getItem' | 'setItem'>) = { getItem, setItem };

  const middleware = persist({ prefix: 'cat-' });
  const state = createState({ middleware });

  const colour = state('Ginger', null, { key: 'colour' });
  const age = state(1, null, { key: 'age' });
  expect(colour.get()).toBe('Ginger');
  expect(age.get()).toBe(1);

  middleware.hydrate();
  expect(colour.get()).toBe('Calico');
  expect(age.get()).toBe(1);
  expect(getItem).toHaveBeenCalledWith('cat-colour');
  expect(getItem).toHaveBeenCalledWith('cat-age');

  age.set(2);
  expect(colour.get()).toBe('Calico');
  expect(age.get()).toBe(2);
  expect(setItem).toHaveBeenCalledWith('cat-age', '2');

  expect(getItem).toHaveBeenCalledTimes(2);
  expect(setItem).toHaveBeenCalledTimes(1);
});

test('persist should warn if a key is not provided in config', () => {
  const state = createState({ middleware: persist() });
  expect(() => state('no key')).toThrow();
  state('with key', null, { key: 'some-key' });
});
