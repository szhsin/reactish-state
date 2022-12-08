import type { Middleware } from '../common';
interface PersistMiddleware extends Middleware {
    hydrate(): void;
}
declare type Persist = (options?: {
    prefix?: string;
    getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
}) => PersistMiddleware;
declare const persist: Persist;
export { persist };
