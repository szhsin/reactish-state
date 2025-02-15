const applyPlugin = plugins => (reactish, config) => plugins.forEach(plugin => plugin == null ? undefined : plugin(reactish, config));

export { applyPlugin };
