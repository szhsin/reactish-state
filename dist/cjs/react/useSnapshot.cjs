'use strict';

var shim = require('./shim.cjs');

const useSnapshot = ({
  subscribe,
  get
}) => shim.useSyncExternalStore(subscribe, get, get);

exports.useSnapshot = useSnapshot;
