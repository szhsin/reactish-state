import type { Plugin, Selector } from '../common';
declare const createSelector: ({ plugin }?: {
    plugin?: Plugin | undefined;
}) => Selector;
declare const selector: Selector;
export type { Selector };
export { selector, createSelector };
