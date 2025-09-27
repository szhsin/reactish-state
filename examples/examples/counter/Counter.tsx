import { useState } from 'react';
import { stateBuilder, selector, useSnapshot } from 'reactish-state';
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

const counter = stateBuilder(
  applyMiddleware([reduxDevtools({ name: 'counterApp-state' }), persistMiddleware.middleware])
)(
  0,
  (set, get) => ({
    // Calling `set` to set a new state
    reset: () => set(0),
    // The functional update of `set` receives the current state and should return a new state
    increase: () => set((i) => i + 1),
    // The current state can be also retrieved with the `get`
    increaseBy: (by: number) => set(get() + by),
    // The redux style dispatch function
    dispatch: (action: { type: ActionTypes; by?: number }) =>
      set((state) => reducer(state, action), action)
  }),
  { key: 'count' }
);

// selector is a piece of derived state from one or more states
const double = selector(counter, (state) => state * 2);

// selector can be derived from other selectors
const quadruple = selector(double, (state) => state * 2);
const summarySelector = selector(counter, double, quadruple, (count, double, quadruple) => ({
  count,
  double,
  quadruple,
  sum: count + double + quadruple
}));

const Counter = ({ id = 1 }: { id: number | string }) => {
  const [step, setStep] = useState(1);
  const count = useSnapshot(counter);
  const summary = useSnapshot(summarySelector);
  const { increase, increaseBy, reset, dispatch } = counter;

  console.log(`#${id} count: ${count}`, 'summary:', summary);

  return (
    <div className={styles.wrapper}>
      <div>
        #{id} count: {count}
      </div>
      <div>summary: {JSON.stringify(summary)}</div>
      <div className={styles.step}>
        Step:{' '}
        <input type="text" value={step} onChange={(e) => setStep(parseInt(e.target.value) || 0)} />
      </div>

      <div>
        <button onClick={() => counter.set(count - step)}>- {step}</button>
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
