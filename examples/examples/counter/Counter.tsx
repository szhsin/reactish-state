import { useState } from 'react';
import { state, useSnapshot } from 'reactish-state';
import styles from './styles.module.css';

const counterState = state(0, (set, get) => ({
  increase: () => set((i) => i + 1),
  increaseBy: (by: number) => set(get() + by),
  reset: () => set(0)
}));

const Counter = ({ id = 1 }: { id: number | string }) => {
  const [step, setStep] = useState(1);
  const count = useSnapshot(counterState);
  const { increase, increaseBy, reset } = counterState.actions!;

  console.log(`#${id} count: ${count}`);

  return (
    <div className={styles.wrapper}>
      <div>
        #{id} count: {count}
      </div>
      <div className={styles.step}>
        Step:{' '}
        <input
          type="text"
          value={step}
          onChange={(e) => setStep(parseInt(e.currentTarget.value) || 1)}
        />
      </div>

      <div>
        <button onClick={() => counterState.set(count - step)}>- {step}</button>
        <button onClick={() => increaseBy(step)}>+ {step}</button>
        <button onClick={() => increase()}>+ 1</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
};

export { Counter };