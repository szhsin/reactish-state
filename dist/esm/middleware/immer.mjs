import { produce } from 'immer';

const immer = ({
  set
}) => (value, context) => set(typeof value === 'function' ? produce(value) : value, context);

export { immer };
