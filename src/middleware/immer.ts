import { produce } from 'immer';
import type { Middleware } from '../types';

const immer: Middleware =
  ({ set }) =>
  (value, context) =>
    set(typeof value === 'function' ? produce(value as (draft: unknown) => void) : value, context);

export { immer };
