import { produce } from 'immer';

var immer = function immer(_ref) {
  var set = _ref.set;
  return function (value) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    return set.apply(void 0, [typeof value === 'function' ? produce(value) : value].concat(rest));
  };
};

export { immer };
