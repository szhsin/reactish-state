import type { Plugin } from '../common';

const applyPlugin: (plugins: Plugin[]) => Plugin = (plugins) => (reactish, config) =>
  plugins.forEach((plugin) => plugin(reactish, config));

export { applyPlugin };
