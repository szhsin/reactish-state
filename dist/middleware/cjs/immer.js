'use strict';

var immer$1 = require('immer');

var immer = function immer(_ref) {
  var set = _ref.set;
  return function (value) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    return set.apply(void 0, [typeof value === 'function' ? immer$1.produce(value) : value].concat(rest));
  };
};

exports.immer = immer;
