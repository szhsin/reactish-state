import { state, selectorBuilder, SelectorBuilder } from '../../';
import { reduxDevtools } from '../../plugin';

describe('reduxDevtools', () => {
  const init = jest.fn();
  const connect = jest.fn().mockReturnValue({ init });

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

  test('should merge selector and send to the dev tool', () => {
    const selector = selectorBuilder(reduxDevtools({ name: 'my-app' }));
    const count = state(1);
    selector(count, (count) => count * 2, { key: 'double' });
    selector(count, (count) => count * 3, { key: 'triple' });

    expect(connect).toHaveBeenLastCalledWith({ name: 'my-app' });
    expect(init).toHaveBeenLastCalledWith({ double: 2, triple: 3 });
    expect(init).toHaveBeenCalledTimes(2);

    count.set(2);
    expect(init).toHaveBeenLastCalledWith({ double: 4, triple: 6 });
    expect(init).toHaveBeenCalledTimes(4);
  });

  test('should warn if a key is not provided in metadata', () => {
    const selector = selectorBuilder(reduxDevtools()) as SelectorBuilder;
    expect(() => selector(state(1), (count) => count * 2)).toThrow();
  });
});

test('reduxDevtools should do nothing when there is no redux devtools extension', () => {
  expect(reduxDevtools()).toBeUndefined();
});
