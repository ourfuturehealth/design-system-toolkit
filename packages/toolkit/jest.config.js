module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.js',
    'tests/**/*.js',
    '!coverage/**',
  ],
  globals: {
    window: true,
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
  ],
  verbose: true,
};
