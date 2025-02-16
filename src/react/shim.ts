import React from 'react';

let useSyncExternalStore = React.useSyncExternalStore;

const setReactShim = ([shim]: readonly [typeof React.useSyncExternalStore]) => {
  useSyncExternalStore = shim;
};

export { useSyncExternalStore, setReactShim };
