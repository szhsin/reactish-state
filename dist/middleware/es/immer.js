import { produce } from 'immer';

var immer = function immer(set) {
  return function (value) {
    return set(typeof value === 'function' ? produce(value) : value);
  };
};

export { immer };
