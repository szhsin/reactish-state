
'use strict';

//#region src/middleware/persist.ts
const persist = ({ prefix, getStorage = () => localStorage } = {}) => {
	const states = [];
	return {
		middleware: ({ set, get, meta }) => {
			let key = meta()?.key;
			if (process.env.NODE_ENV !== "production" && !key) throw new Error("[reactish-state] state should be provided with a string `key` in the config object when the `persist` middleware is used.");
			if (prefix) key = prefix + key;
			states.push([key, set]);
			return (...args) => {
				set(...args);
				try {
					getStorage().setItem(key, JSON.stringify(get()));
				} catch {}
			};
		},
		hydrate: () => {
			states.forEach(([key, set]) => {
				try {
					const value = getStorage().getItem(key);
					if (value != null) set(value !== "undefined" ? JSON.parse(value) : void 0, `HYDRATE_${key}`);
				} catch {}
			});
			states.length = 0;
		}
	};
};

//#endregion
exports.persist = persist;