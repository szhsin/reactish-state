'use strict';

var immer$1 = require('immer');

const immer = ({
  set
}) => (value, ...rest) => set(typeof value === 'function' ? immer$1.produce(value) : value, ...rest);

exports.immer = immer;
