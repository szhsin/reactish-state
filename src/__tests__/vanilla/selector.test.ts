import { state } from '../../vanilla/state';
import { selector, createSelector } from '../../';

test('selector should update when the base state has changed', () => {
  const price = state(7);
  const quantity = state(1);
  const shipping = state(5);
  const subtotal = selector(price, quantity, (price, quantity) => price * quantity);
  const total = selector(subtotal, shipping, (subtotal, shipping) => subtotal + shipping);

  const subtotalListener = jest.fn();
  const totalListener = jest.fn();
  subtotal.subscribe(subtotalListener);
  const unsub = total.subscribe(totalListener);
  expect(subtotal.get()).toBe(7);
  expect(total.get()).toBe(12);

  quantity.set((quantity) => quantity + 2);
  expect(subtotal.get()).toBe(21);
  expect(total.get()).toBe(26);
  expect(subtotalListener).toHaveBeenCalledTimes(1);
  expect(totalListener).toHaveBeenCalledTimes(1);

  shipping.set(4);
  expect(subtotal.get()).toBe(21);
  expect(total.get()).toBe(25);
  expect(subtotalListener).toHaveBeenCalledTimes(1);
  expect(totalListener).toHaveBeenCalledTimes(2);

  price.set(6);
  expect(subtotal.get()).toBe(18);
  expect(total.get()).toBe(22);
  expect(subtotalListener).toHaveBeenCalledTimes(2);
  expect(totalListener).toHaveBeenCalledTimes(3);

  unsub();
  price.set(5);
  expect(subtotal.get()).toBe(15);
  expect(total.get()).toBe(19);
  expect(subtotalListener).toHaveBeenCalledTimes(3);
  expect(totalListener).toHaveBeenCalledTimes(3);
});

test('selector should return cached result when base state has not changed', () => {
  const selectorFunc = jest.fn();
  const rectangle = state({ width: 4, height: 3 });
  const geometry = selector(rectangle, ({ width, height }) => {
    selectorFunc();
    return {
      perimeter: (width + height) * 2,
      area: width * height
    };
  });

  expect(selectorFunc).toHaveBeenCalledTimes(0);
  expect(geometry.get()).toEqual({ perimeter: 14, area: 12 });
  expect(geometry.get()).toBe(geometry.get());
  expect(selectorFunc).toHaveBeenCalledTimes(1);
});

test('selector can be enhanced with plugin', () => {
  const plugin = jest.fn();
  const selector = createSelector({
    plugin: ({ get, subscribe }, config) => {
      const onChange = () => {
        plugin(get(), config?.key);
      };
      onChange();
      subscribe(onChange);
    }
  });

  const count = state(1);
  const double = selector(count, (count) => count * 2, { key: 'double' });

  expect(double.get()).toBe(2);
  expect(plugin).toHaveBeenLastCalledWith(2, 'double');

  count.set(5);
  expect(double.get()).toBe(10);
  expect(plugin).toHaveBeenLastCalledWith(10, 'double');

  expect(plugin).toHaveBeenCalledTimes(2);
});
