'use strict';

var state = function state(initialValue) {
  var value = initialValue;
  var listeners = new Set();
  var set = function set(newValue) {
    value = newValue;
    listeners.forEach(function (listener) {
      return listener();
    });
  };
  return {
    get: function get() {
      return value;
    },
    set: set,
    subscribe: function subscribe(listener) {
      listeners.add(listener);
      return function () {
        listeners["delete"](listener);
      };
    }
  };
};

exports.state = state;
