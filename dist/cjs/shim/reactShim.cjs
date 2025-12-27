
'use strict';
let use_sync_external_store_shim = require("use-sync-external-store/shim/index.js");

//#region src/shim/reactShim.ts
const reactShim = [use_sync_external_store_shim.useSyncExternalStore];

//#endregion
exports.reactShim = reactShim;