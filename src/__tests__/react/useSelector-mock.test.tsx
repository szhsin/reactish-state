/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Reactish } from '../../common';
import { state, useSelector, useSnapshot } from '../../';

jest.mock('../../react/useSnapshot', () => ({
  useSnapshot: jest.fn()
}));

const price = state(0);
const cartRender = jest.fn();

const Cart = ({ useDeps }: { useDeps?: boolean }) => {
  cartRender();
  const [quantity, setQuantity] = React.useState(1);
  const total = useSelector(
    () => [price, (price) => price * quantity],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeps ? [quantity] : undefined
  );
  return (
    <>
      <button data-testid="add" onClick={() => setQuantity((q) => q + 1)}>
        Add quantity
      </button>
      <div data-testid="total">{total}</div>
    </>
  );
};

test.each([true, false])(
  'useSelector should return a stable subscribe function when useDeps is %s',
  (useDeps) => {
    render(<Cart useDeps={useDeps} />);
    fireEvent.click(screen.getByTestId('add'));

    expect(cartRender).toHaveBeenCalledTimes(2);
    expect(useSnapshot).toHaveBeenCalledTimes(2);
    const { calls } = (useSnapshot as jest.Mock<void, [Reactish<unknown>]>).mock;
    expect(calls[0][0].get).not.toBe(calls[1][0].get);
    expect(calls[0][0].subscribe).toBe(calls[1][0].subscribe);
  }
);
