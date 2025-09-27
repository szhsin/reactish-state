import type { Plugin, SelectorBuilder, SelectorBuilderWithMeta } from '../types';
declare const createSelector: <TSelectorMeta = never>({ plugin }?: {
    plugin?: Plugin<TSelectorMeta>;
}) => [TSelectorMeta] extends [never] ? SelectorBuilder : SelectorBuilderWithMeta<TSelectorMeta>;
declare const selector: SelectorBuilder;
export { selector, createSelector };
