const createState = ({
  middleware
} = {}) => (initialValue, actionBuilder, config) => {
  let value = initialValue;
  const listeners = new Set();
  const get = () => value;
  let set = newValue => {
    const nextValue = typeof newValue === 'function' ? newValue(value) : newValue;
    if (!Object.is(value, nextValue)) {
      const prevValue = value;
      value = nextValue;
      listeners.forEach(listener => listener(nextValue, prevValue));
    }
  };
  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  if (middleware) set = middleware({
    set,
    get,
    subscribe
  }, config);
  return {
    ...actionBuilder?.(set, get),
    get,
    set,
    subscribe
  };
};
const state = /*#__PURE__*/createState();

export { createState, state };
