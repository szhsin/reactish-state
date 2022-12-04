import type { Middleware } from '../common';

const persist: Middleware = (set, get, context) => (value) => {
  set(value);
  context &&
    localStorage.setItem((context as unknown as { key: string }).key, JSON.stringify(get()));
};

export { persist };
