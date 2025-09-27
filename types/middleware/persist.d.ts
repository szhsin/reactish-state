import type { Middleware, Metadata } from '../types';
interface Persist<TStateMeta extends Metadata> {
    middleware: Middleware<TStateMeta>;
    hydrate: () => void;
}
declare const persist: <TStateMeta extends Metadata>({ prefix, getStorage }?: {
    prefix?: string;
    getStorage?: () => Pick<Storage, "getItem" | "setItem">;
}) => Persist<TStateMeta>;
export type { Persist };
export { persist };
