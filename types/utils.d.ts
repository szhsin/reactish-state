import type { Subscriber, ReactishArray, ReactishValueArray } from './common';
export declare const isEqual: (args1: unknown[], args2: unknown[]) => boolean;
export declare const createSubscriber: (items: ReactishArray) => Subscriber;
export declare const getReactishValues: <RA extends ReactishArray>(items: ReactishArray) => ReactishValueArray<RA>;
