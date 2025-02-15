'use strict';

const applyPlugin = plugins => (reactish, config) => plugins.forEach(plugin => plugin?.(reactish, config));

exports.applyPlugin = applyPlugin;
