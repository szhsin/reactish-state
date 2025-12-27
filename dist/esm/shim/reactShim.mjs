import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";

//#region src/shim/reactShim.ts
const reactShim = [useSyncExternalStore];

//#endregion
export { reactShim };