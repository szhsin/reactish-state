'use strict';

var React = require('react');

exports.useSyncExternalStore = React.useSyncExternalStore;
const setReactShim = ([shim]) => {
  exports.useSyncExternalStore = shim;
};

exports.setReactShim = setReactShim;
