import React from 'react';

let useSyncExternalStore = React.useSyncExternalStore;
const setReactShim = ([shim]) => {
  useSyncExternalStore = shim;
};

export { setReactShim, useSyncExternalStore };
