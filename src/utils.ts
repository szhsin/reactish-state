import type { Subscriber, ReactishArray, ReactishValueArray } from './common';

export const isEqual = (args1: unknown[], args2: unknown[]) => {
  for (let i = 0; i < args1.length; i++) {
    if (!Object.is(args1[i], args2[i])) return false;
  }
  return true;
};

export const createSubscriber: (items: ReactishArray) => Subscriber = (items) => (listener) => {
  const unsubscribers = items.map((item) => item.subscribe(listener));
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

export const getReactishValues = <RA extends ReactishArray>(items: ReactishArray) =>
  items.map((item) => item.get()) as ReactishValueArray<RA>;
