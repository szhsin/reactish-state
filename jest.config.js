module.exports = {
  testMatch: ['**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  clearMocks: true,
  collectCoverage: true
};
