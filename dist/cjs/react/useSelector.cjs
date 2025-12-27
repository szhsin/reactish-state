
'use strict';
'use client';

const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_utils = require('../utils.cjs');
const require_useSnapshot = require('./useSnapshot.cjs');
let react = require("react");

//#region src/react/useSelector.ts
const useSelector = (selectorParamFactory, deps) => {
	const items = selectorParamFactory();
	const cutoff = items.length - 1;
	const selectorFunc = items[cutoff];
	items.length = cutoff;
	const [context] = (0, react.useState)(() => [, require_utils.createSubscriber(items)]);
	return require_useSnapshot.useSnapshot({
		get: () => {
			const [cache] = context;
			const selectorValues = require_utils.getSelectorValues(items);
			const args = selectorValues.concat(deps || selectorFunc);
			if (cache && require_utils.isEqual(args, cache[0])) return cache[1];
			const value = selectorFunc(...selectorValues);
			context[0] = [args, value];
			return value;
		},
		subscribe: context[1]
	});
};

//#endregion
exports.useSelector = useSelector;