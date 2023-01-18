'use strict';

var shim = require('use-sync-external-store/shim');

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

const isEqual = (args1, args2) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};
const createSelector = ({
  plugin
} = {}) => (...items) => {
  const {
    length
  } = items;
  const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
  const selectorFunc = items[cutoff];
  const config = items[cutoff + 1];
  items.length = cutoff;
  let cache;
  const selector = {
    get: () => {
      const args = items.map(item => item.get());
      if (cache && isEqual(args, cache.args)) return cache.ret;
      const ret = selectorFunc(...args);
      cache = {
        args,
        ret
      };
      return ret;
    },
    subscribe: listener => {
      const unsubscribers = items.map(item => item.subscribe(listener));
      return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }
  };
  plugin == null ? void 0 : plugin(selector, config);
  return selector;
};
const selector = /*#__PURE__*/createSelector();

const useSnapshot = ({
  subscribe,
  get
}) => shim.useSyncExternalStore(subscribe, get, get);

exports.createSelector = createSelector;
exports.createState = createState;
exports.selector = selector;
exports.state = state;
exports.useSnapshot = useSnapshot;
