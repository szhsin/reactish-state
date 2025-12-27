//#region src/plugin/reduxDevtools.ts
const reduxDevtools = ({ name } = {}) => {
	let devtoolsExt;
	if (process.env.NODE_ENV === "production" || typeof window === "undefined" || !(devtoolsExt = window.__REDUX_DEVTOOLS_EXTENSION__)) return;
	const devtools = devtoolsExt.connect({ name });
	const mergedState = {};
	return ({ get, subscribe, meta }) => {
		const key = meta()?.key;
		if (process.env.NODE_ENV !== "production" && !key) throw new Error("[reactish-state] selector should be provided with a string `key` in the config object when the `reduxDevtools` plugin is used.");
		const updateState = () => {
			mergedState[key] = get();
			devtools.init(mergedState);
		};
		updateState();
		subscribe(updateState);
	};
};

//#endregion
export { reduxDevtools };