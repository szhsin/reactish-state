const createState = ({
  middleware
} = {}) => (initialValue, actionBuilder, config) => {
  let value = initialValue;
  const listeners = new Set();
  const get = () => value;
  const readonlyState = {
    get,
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
  }, config);
  return {
    ...actionBuilder?.(set, get),
    ...readonlyState,
    set
  };
};
const state = /*#__PURE__*/createState();

export { createState, state };
