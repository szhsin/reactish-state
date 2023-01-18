const createState = ({
  middleware
} = {}) => (initialValue, actionCreator, config) => {
  let value = initialValue;
  const listeners = new Set();
  const get = () => value;
  let set = newValue => {
    const nextValue = typeof newValue === 'function' ? newValue(value) : newValue;
    if (!Object.is(value, nextValue)) {
      value = nextValue;
      listeners.forEach(listener => listener());
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
    get,
    set,
    subscribe,
    actions: actionCreator && actionCreator(set, get)
  };
};
const state = /*#__PURE__*/createState();

export { createState, state };
