import type { Plugin } from '../types';
declare const applyPlugin: <TConfig>(plugins: (Plugin<TConfig> | undefined)[]) => Plugin<TConfig>;
export { applyPlugin };
