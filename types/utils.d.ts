import type { SelectorSubscriber, SelectorArray, SelectorValueArray } from './common';
export declare const isEqual: (args1: unknown[], args2: unknown[]) => boolean;
export declare const createSubscriber: (items: SelectorArray) => SelectorSubscriber;
export declare const getSelectorValues: <RA extends SelectorArray>(items: SelectorArray) => SelectorValueArray<RA>;
