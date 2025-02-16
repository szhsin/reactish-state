'use strict';

var shim = require('./shim.cjs');

const useSnapshot = ({
  subscribe,
  get
}) => {
  if (process.env.NODE_ENV !== 'production' && !shim.useSyncExternalStore) {
    throw new Error('[reactish-state] Shim setup is required for React 16/17.');
  }
  return shim.useSyncExternalStore(subscribe, get, get);
};

exports.useSnapshot = useSnapshot;
