// src/plugin/applyPlugin.ts
const applyPlugin = (plugins) => (selector) => plugins.forEach((plugin) => plugin?.(selector));
export { applyPlugin };
