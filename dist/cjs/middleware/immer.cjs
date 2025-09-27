'use strict';

var immer$1 = require('immer');

const immer = ({
  set
}) => (value, context) => set(typeof value === 'function' ? immer$1.produce(value) : value, context);

exports.immer = immer;
