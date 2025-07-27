import type { Plugin } from '../common';

const applyPlugin: (plugins: (Plugin | undefined)[]) => Plugin = (plugins) => (selector, config) =>
  plugins.forEach((plugin) => plugin?.(selector, config));

export { applyPlugin };
