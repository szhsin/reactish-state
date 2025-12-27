import { produce } from "immer";

//#region src/middleware/immer.ts
const immer = ({ set }) => (value, context) => set(typeof value === "function" ? produce(value) : value, context);

//#endregion
export { immer };