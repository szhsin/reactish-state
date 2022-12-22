import { produce } from 'immer';
import type { Middleware } from '../common';

const immer: Middleware =
  ({ set }) =>
  (value, ...rest) =>
    set(typeof value === 'function' ? produce(value as (draft: unknown) => void) : value, ...rest);

export { immer };
