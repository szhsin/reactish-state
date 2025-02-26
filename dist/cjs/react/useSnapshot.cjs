'use strict';

var shim = require('./shim.cjs');

const useSnapshot = ({
  subscribe,
  get
}) => {
  if (process.env.NODE_ENV !== 'production' && !shim.useSyncExternalStore) {
    throw new Error('[reactish-state] Shim setup is required for React 16/17. See: https://github.com/szhsin/reactish-state/tree/master?tab=readme-ov-file#react-1617-setup');
  }
  return shim.useSyncExternalStore(subscribe, get, get);
};

exports.useSnapshot = useSnapshot;
