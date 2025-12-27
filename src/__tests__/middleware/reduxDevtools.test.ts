import { stateBuilder, StateBuilder } from '../../';
import { reduxDevtools } from '../../middleware';

describe('reduxDevtools', () => {
  const init = vi.fn();
  const send = vi.fn();
  const connect = vi.fn().mockReturnValue({ init, send });

  beforeAll(() => {
    (global.window as {
      __REDUX_DEVTOOLS_EXTENSION__?: {
        connect: NonNullable<Window['__REDUX_DEVTOOLS_EXTENSION__']>['connect'];
      };
    }) = {
      __REDUX_DEVTOOLS_EXTENSION__: { connect }
    };
  });

  afterAll(() => {
    delete global.window.__REDUX_DEVTOOLS_EXTENSION__;
  });

  test('should send actions', () => {
    const state = stateBuilder(reduxDevtools({ name: 'my-app' }));
    const price = state(0.99, null, { key: 'price' });
    const quantity = state(1, null, { key: 'qty' });

    expect(connect).toHaveBeenLastCalledWith({ name: 'my-app' });
    expect(init).toHaveBeenLastCalledWith({ price: 0.99, qty: 1 });

    quantity.set(2);
    expect(send).toHaveBeenLastCalledWith({ type: 'SET_qty', value: 2 }, { price: 0.99, qty: 2 });

    quantity.set((q) => q + 1, 'increase/qty');
    expect(send).toHaveBeenLastCalledWith({ type: 'increase/qty' }, { price: 0.99, qty: 3 });

    quantity.set((q) => q + 2, { type: 'increaseBy/qty', by: 2 });
    expect(send).toHaveBeenLastCalledWith(
      { type: 'increaseBy/qty', by: 2 },
      { price: 0.99, qty: 5 }
    );

    expect(price.get()).toBe(0.99);
    expect(quantity.get()).toBe(5);
  });

  test('should warn if a key is not provided in metadata', () => {
    const state = stateBuilder(reduxDevtools()) as StateBuilder;
    expect(() => state('no key')).toThrow('[reactish-state]');
    state('with key', null, { key: 'some-key' });
  });
});

test('reduxDevtools should do nothing when there is no redux devtools extension', () => {
  expect(reduxDevtools()).toBeUndefined();
});
