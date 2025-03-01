/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { state, useSnapshot, useSelector } from '../../';

const price = state(0);
const shipping = state(0);
const cartSelector = jest.fn();
const cartRender = jest.fn();

const Cart = ({ useDeps }: { useDeps?: boolean }) => {
  cartRender();
  const [, forceRender] = React.useState(1);
  const [quantity, setQuantity] = React.useState(1);
  const { subtotal, total } = useSelector(
    () => [
      price,
      shipping,
      (price, shipping) => {
        cartSelector();
        const subtotal = price * quantity;
        return {
          subtotal,
          total: subtotal + shipping
        };
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeps ? [quantity] : undefined
  );
  return (
    <>
      <button data-testid="re-render" onClick={() => forceRender((i) => i + 1)}>
        Re-render
      </button>
      <button data-testid="add" onClick={() => setQuantity((q) => q + 1)}>
        Add quantity
      </button>
      <div data-testid="shipping">{useSnapshot(shipping)}</div>
      <div data-testid="subtotal">{subtotal}</div>
      <div data-testid="total">{total}</div>
    </>
  );
};

describe('useSelector', () => {
  beforeEach(() => {
    price.set(7);
    shipping.set(5);
  });

  test('with deps', async () => {
    render(<Cart useDeps />);

    expect(screen.getByTestId('shipping')).toHaveTextContent('5');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('7');
    expect(screen.getByTestId('total')).toHaveTextContent('12');
    expect(cartRender).toHaveBeenCalledTimes(1);
    expect(cartSelector).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('shipping')).toHaveTextContent('5');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('14');
    expect(screen.getByTestId('total')).toHaveTextContent('19');
    expect(cartRender).toHaveBeenCalledTimes(2);
    expect(cartSelector).toHaveBeenCalledTimes(2);

    act(() => {
      price.set(10);
    });
    expect(screen.getByTestId('shipping')).toHaveTextContent('5');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('20');
    expect(screen.getByTestId('total')).toHaveTextContent('25');
    expect(cartRender).toHaveBeenCalledTimes(3);
    expect(cartSelector).toHaveBeenCalledTimes(3);

    // miltiple subscribers on the same base state (shipping) cause a single re-render
    act(() => {
      shipping.set(7);
    });
    expect(screen.getByTestId('shipping')).toHaveTextContent('7');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('20');
    expect(screen.getByTestId('total')).toHaveTextContent('27');
    expect(cartRender).toHaveBeenCalledTimes(4);
    expect(cartSelector).toHaveBeenCalledTimes(4);

    // async update should cause a single re-render on React 16,17,18
    setTimeout(() => shipping.set(9), 100);
    await waitFor(() => expect(screen.getByTestId('shipping')).toHaveTextContent('9'));
    expect(cartRender).toHaveBeenCalledTimes(5);
    expect(cartSelector).toHaveBeenCalledTimes(5);

    // selector returns cached result when no deps have changed
    fireEvent.click(screen.getByTestId('re-render'));
    expect(cartRender).toHaveBeenCalledTimes(6);
    expect(cartSelector).toHaveBeenCalledTimes(5);
  });

  test('w/o deps', () => {
    render(<Cart />);

    expect(screen.getByTestId('shipping')).toHaveTextContent('5');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('7');
    expect(screen.getByTestId('total')).toHaveTextContent('12');
    expect(cartRender).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('shipping')).toHaveTextContent('5');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('14');
    expect(screen.getByTestId('total')).toHaveTextContent('19');
    expect(cartRender).toHaveBeenCalledTimes(2);

    act(() => {
      shipping.set(10);
    });
    expect(screen.getByTestId('shipping')).toHaveTextContent('10');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('14');
    expect(screen.getByTestId('total')).toHaveTextContent('24');
    expect(cartRender).toHaveBeenCalledTimes(3);

    fireEvent.click(screen.getByTestId('re-render'));
    expect(cartRender).toHaveBeenCalledTimes(4);
    expect(cartSelector.mock.calls.length).toBeGreaterThanOrEqual(cartRender.mock.calls.length);
  });
});
