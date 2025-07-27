import type { SelectorSubscriber, SelectorArray, SelectorValueArray } from './common';

export const isEqual = (args1: unknown[], args2: unknown[]) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};

export const createSubscriber: (items: SelectorArray) => SelectorSubscriber =
  (items) => (listener) => {
    const unsubscribers = items.map((item) => item.subscribe(listener));
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  };

export const getSelectorValues = <RA extends SelectorArray>(items: SelectorArray) =>
  items.map((item) => item.get()) as SelectorValueArray<RA>;
