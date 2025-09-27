import type { Plugin } from '../types';

const applyPlugin: <TSelectorMeta>(
  plugins: (Plugin<TSelectorMeta> | undefined)[]
) => Plugin<TSelectorMeta> = (plugins) => (selector) =>
  plugins.forEach((plugin) => plugin?.(selector));

export { applyPlugin };
