import type { Plugin, SelectorBuilder } from '../common';
declare const createSelector: ({ plugin }?: {
    plugin?: Plugin;
}) => SelectorBuilder;
declare const selector: SelectorBuilder;
export { selector, createSelector };
