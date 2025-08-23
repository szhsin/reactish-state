import type { Plugin, SelectorBuilder } from '../types';
declare const createSelector: <TConfig>({ plugin }?: {
    plugin?: Plugin<TConfig>;
}) => SelectorBuilder<TConfig>;
declare const selector: SelectorBuilder<unknown>;
export { selector, createSelector };
