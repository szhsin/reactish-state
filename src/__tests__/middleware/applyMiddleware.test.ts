import type { Middleware } from '../../common';
import { createState } from '../../';
import { applyMiddleware } from '../../middleware';

const middleware = jest.fn();
const createMiddleware: (arg: unknown) => Middleware =
  (arg) =>
  ({ set }) =>
  (...args) => {
    set(...args);
    middleware(arg, ...args);
  };

const middlewares = [createMiddleware(1), createMiddleware(2), createMiddleware(3)];

test('applyMiddleware from left', () => {
  const state = createState({
    middleware: applyMiddleware(middlewares)
  });

  const power = state('off');
  expect(middleware).toHaveBeenCalledTimes(0);
  power.set('on');
  expect(middleware).toHaveBeenCalledTimes(3);
  expect(middleware).toHaveBeenNthCalledWith(1, 1, 'on');
  expect(middleware).toHaveBeenNthCalledWith(2, 2, 'on');
  expect(middleware).toHaveBeenNthCalledWith(3, 3, 'on');
});

test('applyMiddleware from right', () => {
  const state = createState({
    middleware: applyMiddleware(middlewares, { fromRight: true })
  });

  const power = state('off');
  expect(middleware).toHaveBeenCalledTimes(0);
  power.set('on');
  expect(middleware).toHaveBeenCalledTimes(3);
  expect(middleware).toHaveBeenNthCalledWith(1, 3, 'on');
  expect(middleware).toHaveBeenNthCalledWith(2, 2, 'on');
  expect(middleware).toHaveBeenNthCalledWith(3, 1, 'on');
});
