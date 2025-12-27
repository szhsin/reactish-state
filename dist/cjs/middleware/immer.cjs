
'use strict';
let immer = require("immer");

//#region src/middleware/immer.ts
const immer$1 = ({ set }) => (value, context) => set(typeof value === "function" ? (0, immer.produce)(value) : value, context);

//#endregion
exports.immer = immer$1;