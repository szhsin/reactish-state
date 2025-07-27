const applyPlugin = plugins => (selector, config) => plugins.forEach(plugin => plugin?.(selector, config));

export { applyPlugin };
