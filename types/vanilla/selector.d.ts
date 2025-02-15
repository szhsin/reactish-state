import type { Plugin, Selector } from '../common';
declare const createSelector: ({ plugin }?: {
    plugin?: Plugin;
}) => Selector;
declare const selector: Selector;
export type { Selector };
export { selector, createSelector };
