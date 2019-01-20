module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/__setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './.temp/test-reports/junit',
        outputName: './results.xml',
      },
    ],
  ],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: './.temp/test-coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__tests__/**/*.ts',
    '!src/index.ts',
  ],
};
