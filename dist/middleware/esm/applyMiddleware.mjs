const applyMiddleware = (middlewares, {
  fromRight
} = {}) => (api, config) => middlewares[fromRight ? 'reduceRight' : 'reduce']((set, middleware) => middleware ? middleware({
  ...api,
  set
}, config) : set, api.set);

export { applyMiddleware };
