
'use strict';

//#region src/plugin/applyPlugin.ts
const applyPlugin = (plugins) => (selector) => plugins.forEach((plugin) => plugin?.(selector));

//#endregion
exports.applyPlugin = applyPlugin;