import type { Plugin } from '../common';

const applyPlugin: (...plugins: Plugin[]) => Plugin =
  (...plugins) =>
  (...args) =>
    plugins.forEach((plugin) => plugin(...args));

export { applyPlugin };
