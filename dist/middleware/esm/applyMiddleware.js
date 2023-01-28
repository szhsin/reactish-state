const applyMiddleware = (middlewares, {
  fromRight
} = {}) => (api, config) => middlewares[fromRight ? 'reduceRight' : 'reduce']((set, middleware) => middleware ? middleware(Object.assign({}, api, {
  set
}), config) : set, api.set);

export { applyMiddleware };
