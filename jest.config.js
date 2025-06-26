module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts: 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/migrations/**',
    '!src/seeds/**',
    '!src/server.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
},
testTimeout: 30000,
};
// This Jest configuration is set up for a TypeScript Node.js application. It includes settings for the test environment, file transformations, coverage collection, and module name mapping. The configuration specifies that tests are located in the `src` directory, uses `ts-jest` for transforming TypeScript files, and sets up a test timeout of 30 seconds. It also excludes certain files from coverage collection, such as migration and seed files, as well as the main server file.