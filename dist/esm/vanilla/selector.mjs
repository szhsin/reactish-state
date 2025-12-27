import { createSubscriber, getSelectorValues, isEqual } from "../utils.mjs";

//#region src/vanilla/selector.ts
const selectorBuilder = (plugin) => ((...items) => {
	const length = items.length;
	const cutoff = typeof items[length - 1] === "function" ? length - 1 : length - 2;
	const selectorFunc = items[cutoff];
	const metadata = items[cutoff + 1];
	items.length = cutoff;
	let cache;
	const selector$1 = {
		get: () => {
			const args = getSelectorValues(items);
			if (cache && isEqual(args, cache[0])) return cache[1];
			const value = selectorFunc(...args);
			cache = [args, value];
			return value;
		},
		subscribe: createSubscriber(items),
		meta: () => metadata
	};
	plugin?.(selector$1);
	return selector$1;
});
const selector = selectorBuilder();

//#endregion
export { selector, selectorBuilder };