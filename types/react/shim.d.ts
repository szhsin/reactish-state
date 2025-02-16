import React from 'react';
declare let useSyncExternalStore: typeof React.useSyncExternalStore;
declare const setReactShim: ([shim]: readonly [typeof React.useSyncExternalStore]) => void;
export { useSyncExternalStore, setReactShim };
