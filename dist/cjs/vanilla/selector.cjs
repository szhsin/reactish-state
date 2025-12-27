
'use strict';
const require_utils = require('../utils.cjs');

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
			const args = require_utils.getSelectorValues(items);
			if (cache && require_utils.isEqual(args, cache[0])) return cache[1];
			const value = selectorFunc(...args);
			cache = [args, value];
			return value;
		},
		subscribe: require_utils.createSubscriber(items),
		meta: () => metadata
	};
	plugin?.(selector$1);
	return selector$1;
});
const selector = selectorBuilder();

//#endregion
exports.selector = selector;
exports.selectorBuilder = selectorBuilder;