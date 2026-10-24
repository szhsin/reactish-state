import React from "react";
// src/react/shim.ts
let useSyncExternalStore = React.useSyncExternalStore;
const setReactShim = ([shim]) => {
	useSyncExternalStore = shim;
};
export { setReactShim, useSyncExternalStore };
