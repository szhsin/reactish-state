'use client';

import { createSubscriber, getSelectorValues, isEqual } from "../utils.mjs";
import { useSnapshot } from "./useSnapshot.mjs";
import { useState } from "react";

//#region src/react/useSelector.ts
const useSelector = (selectorParamFactory, deps) => {
	const items = selectorParamFactory();
	const cutoff = items.length - 1;
	const selectorFunc = items[cutoff];
	items.length = cutoff;
	const [context] = useState(() => [, createSubscriber(items)]);
	return useSnapshot({
		get: () => {
			const [cache] = context;
			const selectorValues = getSelectorValues(items);
			const args = selectorValues.concat(deps || selectorFunc);
			if (cache && isEqual(args, cache[0])) return cache[1];
			const value = selectorFunc(...selectorValues);
			context[0] = [args, value];
			return value;
		},
		subscribe: context[1]
	});
};

//#endregion
export { useSelector };