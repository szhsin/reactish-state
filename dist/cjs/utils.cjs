
'use strict';

//#region src/utils.ts
const isEqual = (args1, args2) => {
	for (let i = 0; i < args1.length; i++) if (!Object.is(args1[i], args2[i])) return false;
	return true;
};
const createSubscriber = (items) => (listener) => {
	const unsubscribers = items.map((item) => item.subscribe(listener));
	return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};
const getSelectorValues = (items) => items.map((item) => item.get());

//#endregion
exports.createSubscriber = createSubscriber;
exports.getSelectorValues = getSelectorValues;
exports.isEqual = isEqual;