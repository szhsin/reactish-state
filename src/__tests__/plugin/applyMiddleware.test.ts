import type { Plugin } from '../../types';
import { state, selectorBuilder } from '../../';
import { applyPlugin } from '../../plugin';

const plugin = vi.fn();
const createPlugin: <TMeta = never>(name: string) => Plugin<TMeta> =
  (name) =>
  ({ get, subscribe, meta }) => {
    subscribe(() => {
      plugin(name, meta(), get());
    });
  };

test('applyPlugin without metadata', () => {
  const selector = selectorBuilder(
    applyPlugin([createPlugin('plugin 1'), createPlugin('plugin 2'), undefined])
  );

  const count = state(1);
  selector(count, (count) => count * 2);

  expect(plugin).toHaveBeenCalledTimes(0);
  count.set(5);
  expect(plugin).toHaveBeenCalledTimes(2);
  expect(plugin).toHaveBeenNthCalledWith(1, 'plugin 1', undefined, 10);
  expect(plugin).toHaveBeenNthCalledWith(2, 'plugin 2', undefined, 10);
});

test('applyPlugin with metadata', () => {
  const selector = selectorBuilder(
    applyPlugin([createPlugin<string>('plugin 1'), createPlugin<string>('plugin 2'), undefined])
  );

  const count = state(1);
  selector(count, (count) => count * 2, 'double');

  expect(plugin).toHaveBeenCalledTimes(0);
  count.set(5);
  expect(plugin).toHaveBeenCalledTimes(2);
  expect(plugin).toHaveBeenNthCalledWith(1, 'plugin 1', 'double', 10);
  expect(plugin).toHaveBeenNthCalledWith(2, 'plugin 2', 'double', 10);
});
