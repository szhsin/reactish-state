'use strict';

const applyPlugin = plugins => selector => plugins.forEach(plugin => plugin?.(selector));

exports.applyPlugin = applyPlugin;
