"use strict";
const require_runtime = require("../_virtual/_rolldown/runtime.cjs");
let react = require("react");
react = require_runtime.__toESM(react);
//#region src/react/shim.ts
let useSyncExternalStore = react.default.useSyncExternalStore;
const setReactShim = ([shim]) => {
	useSyncExternalStore = shim;
};
//#endregion
exports.setReactShim = setReactShim;
Object.defineProperty(exports, "useSyncExternalStore", {
	enumerable: true,
	get: function() {
		return useSyncExternalStore;
	}
});
