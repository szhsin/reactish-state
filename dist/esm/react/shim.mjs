import React from "react";

//#region src/react/shim.ts
let useSyncExternalStore = React.useSyncExternalStore;
const setReactShim = ([shim]) => {
	useSyncExternalStore = shim;
};

//#endregion
export { setReactShim, useSyncExternalStore };