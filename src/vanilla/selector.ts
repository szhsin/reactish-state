import type {
  Plugin,
  Selector,
  SelectorArray,
  SelectorFunc,
  SelectorBuilder,
  SelectorBuilderWithMeta
} from '../types';
import { isEqual, createSubscriber, getSelectorValues } from '../utils';

const selectorBuilder = <TSelectorMeta = never>(plugin?: Plugin<TSelectorMeta>) =>
  (<TArray extends SelectorArray, TValue, TMeta extends TSelectorMeta>(...items: unknown[]) => {
    const length = items.length;
    const cutoff = typeof items[length - 1] === 'function' ? length - 1 : length - 2;
    const selectorFunc = items[cutoff] as SelectorFunc<TArray, TValue>;
    const metadata = items[cutoff + 1] as TMeta;
    items.length = cutoff;
    let cache: readonly [unknown[], TValue] | undefined;

    const selector: Selector<TValue, TMeta> = {
      get: () => {
        const args = getSelectorValues<TArray>(items as SelectorArray);
        if (cache && isEqual(args, cache[0])) return cache[1];
        const value = selectorFunc(...args);
        cache = [args, value];
        return value;
      },
      subscribe: createSubscriber(items as SelectorArray),
      meta: () => metadata
    };

    plugin?.(selector);
    return selector;
    // Wrap TSelectorMeta in a tuple to prevent conditional type distribution;
  }) as [TSelectorMeta] extends [never] ? SelectorBuilder : SelectorBuilderWithMeta<TSelectorMeta>;

const selector = selectorBuilder();

export { selector, selectorBuilder };
