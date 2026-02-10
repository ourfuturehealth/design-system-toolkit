module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/react-components/'
  ],
  globals: {
    window: true,
  },
  verbose: true,
};
