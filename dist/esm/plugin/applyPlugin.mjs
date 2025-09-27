const applyPlugin = plugins => selector => plugins.forEach(plugin => plugin?.(selector));

export { applyPlugin };
