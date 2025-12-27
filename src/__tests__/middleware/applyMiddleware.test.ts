import type { Middleware } from '../../types';
import { stateBuilder } from '../../';
import { applyMiddleware } from '../../middleware';

const middleware = vi.fn();
const createMiddleware: <TStateMeta = never>(name: string) => Middleware<TStateMeta> =
  (name) =>
  ({ set, meta }) =>
  (...args) => {
    set(...args);
    middleware(name, meta(), ...args);
  };

const middlewares = [
  createMiddleware('mw 1'),
  createMiddleware('mw 2'),
  createMiddleware('mw 3'),
  undefined
];

test('applyMiddleware from left', () => {
  const state = stateBuilder(applyMiddleware(middlewares));

  const power = state('off');
  expect(middleware).toHaveBeenCalledTimes(0);
  power.set('on');
  expect(middleware).toHaveBeenCalledTimes(3);
  expect(middleware).toHaveBeenNthCalledWith(1, 'mw 1', undefined, 'on');
  expect(middleware).toHaveBeenNthCalledWith(2, 'mw 2', undefined, 'on');
  expect(middleware).toHaveBeenNthCalledWith(3, 'mw 3', undefined, 'on');
});

test('applyMiddleware from right', () => {
  const state = stateBuilder(applyMiddleware(middlewares, { fromRight: true }));

  const power = state('off');
  expect(middleware).toHaveBeenCalledTimes(0);
  power.set('on');
  expect(middleware).toHaveBeenCalledTimes(3);
  expect(middleware).toHaveBeenNthCalledWith(1, 'mw 3', undefined, 'on');
  expect(middleware).toHaveBeenNthCalledWith(2, 'mw 2', undefined, 'on');
  expect(middleware).toHaveBeenNthCalledWith(3, 'mw 1', undefined, 'on');
});

test('applyMiddleware with state metadata', () => {
  const state = stateBuilder(
    applyMiddleware([createMiddleware<string>('mw 1'), undefined, createMiddleware<string>('mw 2')])
  );

  const metadata = '230V AC';
  const power = state('off', undefined, metadata);
  expect(middleware).toHaveBeenCalledTimes(0);
  power.set('on');
  expect(middleware).toHaveBeenCalledTimes(2);
  expect(middleware).toHaveBeenNthCalledWith(1, 'mw 1', metadata, 'on');
  expect(middleware).toHaveBeenNthCalledWith(2, 'mw 2', metadata, 'on');
});
