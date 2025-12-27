
'use strict';

//#region src/vanilla/state.ts
const stateBuilder = (middleware) => ((initialValue, actionBuilder, metadata) => {
	let value = initialValue;
	const listeners = /* @__PURE__ */ new Set();
	const get = () => value;
	const readonlyState = {
		get,
		meta: () => metadata,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		}
	};
	let set = (newValue) => {
		const nextValue = typeof newValue === "function" ? newValue(value) : newValue;
		if (!Object.is(value, nextValue)) {
			const prevValue = value;
			value = nextValue;
			listeners.forEach((listener) => listener(nextValue, prevValue));
		}
	};
	if (middleware) set = middleware({
		...readonlyState,
		set
	});
	return {
		...actionBuilder?.(set, get),
		...readonlyState,
		set
	};
});
const state = stateBuilder();

//#endregion
exports.state = state;
exports.stateBuilder = stateBuilder;