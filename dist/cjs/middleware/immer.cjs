"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let immer = require("immer");
// src/middleware/immer.ts
const immer$1 = ({ set }) => (value, context) => set(typeof value === "function" ? (0, immer.produce)(value) : value, context);
exports.immer = immer$1;
