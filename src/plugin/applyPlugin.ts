import type { Plugin } from '../types';

const applyPlugin: <TConfig>(plugins: (Plugin<TConfig> | undefined)[]) => Plugin<TConfig> =
  (plugins) => (selector, config) =>
    plugins.forEach((plugin) => plugin?.(selector, config));

export { applyPlugin };
