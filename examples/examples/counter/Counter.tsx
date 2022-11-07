import { state, useSnapshot } from 'reactish-state';

const countState = state(0, (set, get) => ({
  increaseBy: (by: number) => set(get() + by),
  reset: () => set(0)
}));

const Counter = () => {
  const count = useSnapshot(countState);
  const { increaseBy } = countState.actions!;

  return (
    <div>
      <button onClick={() => countState.set(count - 1)}>-</button>
      {count}
      <button onClick={() => increaseBy(1)}>+</button>
    </div>
  );
};

export { Counter };
