module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.js',
    '!packages/react-components/**', // ignore react library tests, they have their own vitest tests
    '!packages/example-react-consumer-app/**', // ignore react example consumer app tests, they have their own vitest tests
  ],
  globals: {
    window: true,
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/react-components/',
    '/packages/example-react-consumer-app/',
  ],
  verbose: true,
};
