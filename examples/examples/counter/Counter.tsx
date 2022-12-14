import { useState } from 'react';
import { createState, selector, useSnapshot, StateCreator } from 'reactish-state';
import { applyMiddleware, persist, reduxDevtools } from 'reactish-state/middleware';
import styles from './styles.module.css';

const persistMiddleware = persist({ prefix: 'counter-', getStorage: () => sessionStorage });
const state: StateCreator = createState({
  middleware: applyMiddleware(persistMiddleware, reduxDevtools)
});
const counterState = state(
  0,
  (set, get) => ({
    increase: () => set((i) => i + 1),
    increaseBy: (by: number) => set(get() + by),
    reset: () => set(0)
  }),
  { key: 'count' }
);

const doubleCount = selector(counterState, (count) => count * 2);
const quadrupleCount = selector(doubleCount, (count) => count * 2);
const countSummary = selector(
  counterState,
  doubleCount,
  quadrupleCount,
  (count, doubleCount, quadrupleCount) => ({
    doubleCount,
    quadrupleCount,
    sum: count + doubleCount + quadrupleCount
  })
);

const Counter = ({ id = 1 }: { id: number | string }) => {
  const [step, setStep] = useState(1);
  const count = useSnapshot(counterState);
  const summary = useSnapshot(countSummary);
  const { increase, increaseBy, reset } = counterState.actions;

  console.log(`#${id} count: ${count}`, 'summary:', summary);

  return (
    <div className={styles.wrapper}>
      <div>
        #{id} count: {count}
      </div>
      <div>summary: {JSON.stringify(summary)}</div>
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

export { Counter, persistMiddleware };
