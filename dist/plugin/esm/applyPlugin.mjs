const applyPlugin = plugins => (reactish, config) => plugins.forEach(plugin => plugin?.(reactish, config));

export { applyPlugin };
