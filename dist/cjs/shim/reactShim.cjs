'use strict';

var shim = require('use-sync-external-store/shim/index.js');

const reactShim = [shim.useSyncExternalStore];

exports.reactShim = reactShim;
