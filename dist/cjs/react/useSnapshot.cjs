'use strict';

var shim = require('use-sync-external-store/shim/index.js');

const useSnapshot = ({
  subscribe,
  get
}) => shim.useSyncExternalStore(subscribe, get, get);

exports.useSnapshot = useSnapshot;
