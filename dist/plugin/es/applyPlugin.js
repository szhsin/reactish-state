var applyPlugin = function applyPlugin(plugins) {
  return function (reactish, config) {
    return plugins.forEach(function (plugin) {
      return plugin(reactish, config);
    });
  };
};

export { applyPlugin };
