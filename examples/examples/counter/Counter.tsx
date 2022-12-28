import { useState } from 'react';
import { createState, selector, useSnapshot } from 'reactish-state';
import { applyMiddleware, persist, reduxDevtools } from 'reactish-state/middleware';
import styles from './styles.module.css';

type ActionTypes = 'INCREASE' | 'DECREASE';

const reducer = (state: number, { type, by = 1 }: { type: ActionTypes; by?: number }) => {
  switch (type) {
    case 'INCREASE':
      return state + by;
    case 'DECREASE':
      return state - by;
  }
};

const persistMiddleware = persist({ prefix: 'counter-', getStorage: () => sessionStorage });

const counterState = createState({
  middleware: applyMiddleware(persistMiddleware, reduxDevtools({ name: 'counterApp-state' }))
})(
  0,
  (set, get) => ({
    increase: () => set((i) => i + 1),
    increaseBy: (by: number) => set(get() + by),
    reset: () => set(0),
    dispatch: (action: { type: ActionTypes; by?: number }) =>
      set((state) => reducer(state, action), action)
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
  const { increase, increaseBy, reset, dispatch } = counterState.actions;

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
        <button onClick={() => dispatch({ type: 'INCREASE', by: 7 })}>+ 7</button>
        <button onClick={() => dispatch({ type: 'DECREASE', by: 3 })}>- 3</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
};

export { Counter, persistMiddleware };
