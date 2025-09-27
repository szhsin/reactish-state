'use strict';

const createState = ({
  middleware
} = {}) => (initialValue, actionBuilder, metadata) => {
  let value = initialValue;
  const listeners = new Set();
  const get = () => value;
  const readonlyState = {
    get,
    meta: () => metadata,
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
  let set = newValue => {
    const nextValue = typeof newValue === 'function' ? newValue(value) : newValue;
    if (!Object.is(value, nextValue)) {
      const prevValue = value;
      value = nextValue;
      listeners.forEach(listener => listener(nextValue, prevValue));
    }
  };
  if (middleware) set = middleware({
    ...readonlyState,
    set
  });
  return {
    ...actionBuilder?.(set, get),
    ...readonlyState,
    set
  };
  // Wrap TStateMeta in a tuple to prevent conditional type distribution
};
const state = /*#__PURE__*/createState();

exports.createState = createState;
exports.state = state;
