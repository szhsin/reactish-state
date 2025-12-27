import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: 'node',
    include: ['src/__tests__/**/*.test.?(c|m)[jt]s?(x)'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*.ts?(x)'],
      exclude: ['src/__tests__', 'index.ts']
    },
    setupFiles: ['@testing-library/jest-dom']
  }
});
