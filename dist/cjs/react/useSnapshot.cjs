
'use strict';
'use client';

const require_shim = require('./shim.cjs');

//#region src/react/useSnapshot.ts
const useSnapshot = ({ subscribe, get }) => {
	if (process.env.NODE_ENV !== "production" && !require_shim.useSyncExternalStore) throw new Error("[reactish-state] Shim setup is required for React 16/17. See: https://github.com/szhsin/reactish-state/tree/master?tab=readme-ov-file#react-1617-setup");
	return require_shim.useSyncExternalStore(subscribe, get, get);
};

//#endregion
exports.useSnapshot = useSnapshot;