var persist = function persist(set, get, context) {
  return function (value) {
    set(value);
    context && localStorage.setItem(context.key, JSON.stringify(get()));
  };
};

export { persist };
