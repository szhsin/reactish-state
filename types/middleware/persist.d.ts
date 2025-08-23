import type { Middleware, Config } from '../types';
interface PersistMiddleware extends Middleware<Config> {
    hydrate(this: void): void;
}
type Persist = (options?: {
    prefix?: string;
    getStorage?: () => Pick<Storage, 'getItem' | 'setItem'>;
}) => PersistMiddleware;
declare const persist: Persist;
export type { Persist, PersistMiddleware };
export { persist };
