'use strict';

const applyMiddleware = (middlewares, {
  fromRight
} = {}) => api => middlewares[fromRight ? 'reduceRight' : 'reduce']((set, middleware) => middleware ? middleware({
  ...api,
  set
}) : set, api.set);

exports.applyMiddleware = applyMiddleware;
