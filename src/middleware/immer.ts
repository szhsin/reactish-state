import { produce } from 'immer';
import type { Middleware } from '../types';

const immer: Middleware =
  ({ set }) =>
  (value, ...rest) =>
    set(typeof value === 'function' ? produce(value as (draft: unknown) => void) : value, ...rest);

export { immer };
