"use strict";
// src/plugin/applyPlugin.ts
const applyPlugin = (plugins) => (selector) => plugins.forEach((plugin) => plugin?.(selector));
exports.applyPlugin = applyPlugin;
