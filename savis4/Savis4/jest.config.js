module.exports = {
  testEnvironment: 'jsdom',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: '<rootDir>/setup-jest.ts',
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!lodash-es/)"
  ],
  testMatch: ['src/app/**/*.spec.ts', '**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'lcov', 'html'
  ],
  testPathIgnorePatterns: [
    "/savis3-darwin-x64/",
    "/savis3-linux-x64/",
    "/savis3-win32-x64/",
    "/build/",
  ],
  coveragePathIgnorePatterns: [
    "/src/app/Utils/",
    "savis3-darwin-x64/",
    "savis3-linux-x64/",
    "savis3-win32-x64/",
    "build",
  ],
  setupFiles: ['jest-canvas-mock'],
};
