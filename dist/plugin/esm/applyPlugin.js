const applyPlugin = plugins => (reactish, config) => plugins.forEach(plugin => plugin == null ? void 0 : plugin(reactish, config));

export { applyPlugin };
