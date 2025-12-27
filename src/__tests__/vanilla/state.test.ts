import { state, stateBuilder, Metadata } from '../../';

test('function overloads and type correctness', () => {
  const s1 = state('s1');
  expect(s1.get().trim()).toBe('s1');
  expect(s1.meta()).toBeUndefined();

  const s2 = state<string>();
  expect(s2.get()?.trim()).toBeUndefined();
  expect(s2.meta()).toBeUndefined();

  const s2ctx = state<string, number>();
  expect(s2ctx.get()?.trim()).toBeUndefined();
  expect(s2ctx.meta()).toBeUndefined();
  s2ctx.set('context', 1);

  const s3 = state([] as string[]);
  expect(s3.get()[0]?.trim()).toBeUndefined();

  const s4 = state([] as string[], (set, get) => ({
    append: (newValue: string) => set([...get(), newValue])
  }));
  s4.append('s4');
  expect(s4.get()[0].trim()).toBe('s4');
  expect(s4.meta()).toBeUndefined();

  // Custom actions must not override built-in state properties
  const s5 = state([] as string[], (set, get) => ({
    append: (newValue: string) => set([...get(), newValue]),
    set: () => set([])
  }));
  s5.append('tmp');
  expect(s5.get()).toEqual(['tmp']);
  s5.set(['s5']);
  expect(s5.get()[0].trim()).toBe('s5');

  const s6 = state<string[], { append: (newValue: string) => void }>([], (set, get) => ({
    append: (newValue) => set([...get(), newValue])
  }));
  s6.append('s6');
  expect(s6.get()[0].trim()).toBe('s6');
  expect(s6.meta()).toBeUndefined();

  const s6ctx = state<string[], { append: (newValue: string) => void }, number>([], (set, get) => ({
    append: (newValue) => set([...get(), newValue])
  }));
  s6ctx.append('s6');
  expect(s6ctx.get()[0].trim()).toBe('s6');
  expect(s6ctx.meta()).toBeUndefined();
  s6ctx.set(['context'], 1);

  const s7 = state<string[], Metadata>([], null, { key: 's7' });
  expect(s7.get()[0]?.trim()).toBeUndefined();
  expect(s7.meta().key).toBe('s7');

  const s7inf = state('s7inf', null, { key: 's7inf' });
  expect(s7inf.get().trim()).toBe('s7inf');
  expect(s7inf.meta().key).toBe('s7inf');

  const s7ctx = state<string[], Metadata, number>([], null, { key: 's7ctx' });
  expect(s7ctx.get()[0]?.trim()).toBeUndefined();
  expect(s7ctx.meta().key).toBe('s7ctx');
  s7ctx.set(['context'], 1);

  const s8 = state<string | undefined, Metadata>(undefined, undefined, { key: 's8' });
  expect(s8.get()?.trim()).toBeUndefined();
  expect(s8.meta().key).toBe('s8');

  const s8ctx = state<string | undefined, Metadata, number>(undefined, undefined, {
    key: 's8ctx'
  });
  expect(s8ctx.get()?.trim()).toBeUndefined();
  expect(s8ctx.meta().key).toBe('s8ctx');
  s8ctx.set('context', 1);

  const s9 = state<string[], { append: (newValue: string) => void }, Metadata>(
    [],
    (set, get) => ({
      append: (newValue) => set([...get(), newValue])
    }),
    { key: 's9' }
  );
  s9.append('s9');
  expect(s9.get()[0].trim()).toBe('s9');
  expect(s9.meta().key).toBe('s9');

  const s9inf = state(
    [''],
    (set, get) => ({
      append: (newValue: string) => set([...get(), newValue])
    }),
    { key: 's9inf' }
  );
  s9inf.append('s9inf');
  expect(s9inf.get()[1].trim()).toBe('s9inf');
  expect(s9inf.meta().key).toBe('s9inf');

  const s9ctx = state<string[], { append: (newValue: string) => void }, Metadata, number>(
    [],
    (set, get) => ({
      append: (newValue) => set([...get(), newValue])
    }),
    { key: 's9ctx' }
  );
  s9ctx.append('s9ctx');
  expect(s9ctx.get()[0].trim()).toBe('s9ctx');
  expect(s9ctx.meta().key).toBe('s9ctx');
  s9ctx.set(['context'], 1);
});

test('state should notify listeners when updated', () => {
  const listener = vi.fn();
  const secondListener = vi.fn();
  const testState = state({ count: 0 });
  const unsub = testState.subscribe(listener);
  testState.subscribe(secondListener);
  testState.subscribe((nextValue) => {
    expect(nextValue).toEqual(testState.get());
  });
  expect(testState.get()).toEqual({ count: 0 });

  testState.set((state) => ({ count: state.count + 1 }));
  expect(testState.get()).toEqual({ count: 1 });
  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenLastCalledWith({ count: 1 }, { count: 0 });
  expect(secondListener).toHaveBeenCalledTimes(1);
  expect(secondListener).toHaveBeenLastCalledWith({ count: 1 }, { count: 0 });

  const newState = { count: 5 };
  testState.set(newState);
  expect(testState.get()).toEqual({ count: 5 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenLastCalledWith({ count: 5 }, { count: 1 });
  expect(secondListener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenLastCalledWith({ count: 5 }, { count: 1 });

  testState.set(newState);
  expect(testState.get()).toEqual({ count: 5 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenCalledTimes(2);

  unsub();
  testState.set({ count: 10 });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(secondListener).toHaveBeenCalledTimes(3);
  expect(secondListener).toHaveBeenLastCalledWith({ count: 10 }, { count: 5 });
});

test('state can bind actions', () => {
  const listener = vi.fn();
  const testState = state(0, (set, get) => ({
    increase: (by = 1) => set((state) => state + by),
    decrease: (by = 1) => set(get() - by),
    reset: () => set(0)
  }));
  testState.subscribe(listener);
  expect(testState.get()).toBe(0);

  const { increase, decrease, reset } = testState;
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
  const middleware = vi.fn();
  const state = stateBuilder<Metadata>(({ set, get, meta }) => (...arg) => {
    set(...arg);
    middleware(get(), meta().key);
  });

  const key = 'count';
  const testState = state(0, null, { key, allowExtraProp: true });

  testState.set(5);
  expect(testState.get()).toBe(5);
  expect(middleware).toHaveBeenLastCalledWith(5, key);

  testState.set((state) => state + 2);
  expect(testState.get()).toBe(7);
  expect(middleware).toHaveBeenLastCalledWith(7, key);

  expect(middleware).toHaveBeenCalledTimes(2);
});
