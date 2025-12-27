
'use strict';
const require_state = require('./vanilla/state.cjs');
const require_selector = require('./vanilla/selector.cjs');
const require_shim = require('./react/shim.cjs');
const require_useSnapshot = require('./react/useSnapshot.cjs');
const require_useSelector = require('./react/useSelector.cjs');

exports.selector = require_selector.selector;
exports.selectorBuilder = require_selector.selectorBuilder;
exports.setReactShim = require_shim.setReactShim;
exports.state = require_state.state;
exports.stateBuilder = require_state.stateBuilder;
exports.useSelector = require_useSelector.useSelector;
exports.useSnapshot = require_useSnapshot.useSnapshot;