import type { Plugin, SelectorBuilder, SelectorBuilderWithMeta } from '../types';
declare const selectorBuilder: <TSelectorMeta = never>(plugin?: Plugin<TSelectorMeta>) => [TSelectorMeta] extends [never] ? SelectorBuilder : SelectorBuilderWithMeta<TSelectorMeta>;
declare const selector: SelectorBuilder;
export { selector, selectorBuilder };
