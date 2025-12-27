//#region src/middleware/applyMiddleware.ts
const applyMiddleware = (middlewares, { fromRight } = {}) => (api) => middlewares[fromRight ? "reduceRight" : "reduce"]((set, middleware) => middleware ? middleware({
	...api,
	set
}) : set, api.set);

//#endregion
export { applyMiddleware };