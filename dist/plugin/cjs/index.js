'use strict';

var applyPlugin = function applyPlugin() {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return plugins.forEach(function (plugin) {
      return plugin.apply(void 0, args);
    });
  };
};

var reduxDevtools = function reduxDevtools(_ref, config) {
  var get = _ref.get,
    subscribe = _ref.subscribe;
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return;
  var devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: config == null ? void 0 : config.key
  });
  devtools.init(get());
  subscribe(function () {
    return devtools.init(get());
  });
};

exports.applyPlugin = applyPlugin;
exports.reduxDevtools = reduxDevtools;
