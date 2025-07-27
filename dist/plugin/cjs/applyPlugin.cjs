'use strict';

const applyPlugin = plugins => (selector, config) => plugins.forEach(plugin => plugin?.(selector, config));

exports.applyPlugin = applyPlugin;
