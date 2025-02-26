/**
 * @jest-environment jsdom
 */
import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { state, selector, useSnapshot } from '../../';

test('useSnapshot', () => {
  const testState = state(1);
  const { result } = renderHook(() => useSnapshot(testState));
  expect(result.current).toBe(1);

  act(() => {
    testState.set(2);
  });
  expect(result.current).toBe(2);
});

describe('Render behaviour', () => {
  const count = state(1, (set) => ({
    increase: (by = 1) => set((count) => count + by),
    reset: () => set(1)
  }));

  // Boxing the value in an object is not necessary, but we do it here to verify selector caching.
  const double = selector(count, (count) => ({ value: count * 2 }));
  const remainder = selector(count, (count) => count % 2);

  beforeEach(() => {
    count.reset();
  });

  test('Single subscriber', () => {
    const renderCounter = jest.fn();
    const Counter = () => {
      renderCounter();
      return (
        <div>
          <div data-testid="count">{useSnapshot(count)}</div>
          <button onClick={() => count.increase()}>Increase</button>
        </div>
      );
    };

    const renderDouble = jest.fn();
    const Double = () => {
      renderDouble();
      return <div data-testid="double">{useSnapshot(double).value}</div>;
    };

    const renderRemainder = jest.fn();
    const Remainder = () => {
      renderRemainder();
      return <div data-testid="remainder">{useSnapshot(remainder)}</div>;
    };

    render(
      <>
        <Counter />
        <Double />
        <Remainder />
      </>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('double')).toHaveTextContent('2');
    expect(screen.getByTestId('remainder')).toHaveTextContent('1');
    expect(renderCounter).toHaveBeenCalledTimes(1);
    expect(renderDouble).toHaveBeenCalledTimes(1);
    expect(renderRemainder).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('double')).toHaveTextContent('4');
    expect(screen.getByTestId('remainder')).toHaveTextContent('0');
    expect(renderCounter).toHaveBeenCalledTimes(2);
    expect(renderDouble).toHaveBeenCalledTimes(2);
    expect(renderRemainder).toHaveBeenCalledTimes(2);

    act(() => {
      count.increase(2);
    });
    expect(screen.getByTestId('count')).toHaveTextContent('4');
    expect(screen.getByTestId('double')).toHaveTextContent('8');
    expect(screen.getByTestId('remainder')).toHaveTextContent('0');
    expect(renderCounter).toHaveBeenCalledTimes(3);
    expect(renderDouble).toHaveBeenCalledTimes(3);
    expect(renderRemainder).toHaveBeenCalledTimes(2);

    act(() => {
      count.set(5);
    });
    expect(screen.getByTestId('count')).toHaveTextContent('5');
    expect(screen.getByTestId('double')).toHaveTextContent('10');
    expect(screen.getByTestId('remainder')).toHaveTextContent('1');
    expect(renderCounter).toHaveBeenCalledTimes(4);
    expect(renderDouble).toHaveBeenCalledTimes(4);
    expect(renderRemainder).toHaveBeenCalledTimes(3);

    // Set the same value again
    // Components should not re-render if an update does not result in a state change
    act(() => {
      count.set(5);
    });
    expect(screen.getByTestId('count')).toHaveTextContent('5');
    expect(screen.getByTestId('double')).toHaveTextContent('10');
    expect(screen.getByTestId('remainder')).toHaveTextContent('1');
    expect(renderCounter).toHaveBeenCalledTimes(4);
    expect(renderDouble).toHaveBeenCalledTimes(4);
    expect(renderRemainder).toHaveBeenCalledTimes(3);
  });

  test('Miltiple subscribers on the same base state', async () => {
    const renderer = jest.fn();
    const Miltiple = () => {
      renderer();
      return (
        <div>
          <div data-testid="miltiple">
            {useSnapshot(count)} {useSnapshot(double).value} {useSnapshot(remainder)}
          </div>
          <button onClick={() => count.increase()}>Increase</button>
        </div>
      );
    };

    render(<Miltiple />);
    expect(screen.getByTestId('miltiple')).toHaveTextContent('1 2 1');
    expect(renderer).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByTestId('miltiple')).toHaveTextContent('2 4 0');
    expect(renderer).toHaveBeenCalledTimes(2);

    // async update should cause a single re-render on React 16,17,18
    setTimeout(() => count.increase(), 100);
    await waitFor(() => expect(screen.getByTestId('miltiple')).toHaveTextContent('3 6 1'));
    expect(renderer).toHaveBeenCalledTimes(3);
  });
});
