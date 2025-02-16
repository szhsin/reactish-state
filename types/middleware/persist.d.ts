import type { Middleware } from '../common';
interface PersistMiddleware extends Middleware {
    hydrate(this: void): void;
}
type Persist = (options?: {
    prefix?: string;
    getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
}) => PersistMiddleware;
declare const persist: Persist;
export type { Persist, PersistMiddleware };
export { persist };
