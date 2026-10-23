import { produce } from "immer";
// src/middleware/immer.ts
const immer = ({ set }) => (value, context) => set(typeof value === "function" ? produce(value) : value, context);
export { immer };
