import type { Plugin } from '../types';
declare const applyPlugin: <TSelectorMeta>(plugins: (Plugin<TSelectorMeta> | undefined)[]) => Plugin<TSelectorMeta>;
export { applyPlugin };
