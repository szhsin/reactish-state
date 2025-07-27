'use strict';

const createState = ({
  middleware
} = {}) => (initialValue, actionCreator, config) => {
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
    ...actionCreator?.(set, get),
    get,
    set,
    subscribe
  };
};
const state = /*#__PURE__*/createState();

exports.createState = createState;
exports.state = state;
