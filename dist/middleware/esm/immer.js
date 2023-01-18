import { produce } from 'immer';

const immer = ({
  set
}) => (value, ...rest) => set(typeof value === 'function' ? produce(value) : value, ...rest);

export { immer };
