import { state, useSnapshot } from 'reactish-state';

const countState = state(0);
const Counter = () => {
  const count = useSnapshot(countState);

  return (
    <div>
      <button onClick={() => countState.set(count - 1)}>-</button>
      {count}
      <button onClick={() => countState.set(count + 1)}>+</button>
    </div>
  );
};

export { Counter };
