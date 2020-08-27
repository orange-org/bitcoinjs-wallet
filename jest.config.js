const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  setupFiles: ['<rootDir>/jest/setupFile.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupFileAfterEnv.js'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules)[/\\\\]'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/typings/**/*',
    '!**/*.testUtils.{ts,tsx}',
    '!**/testUtils/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testRegex: '((\\.|/)(test|spec))\\.[jt]sx?$',
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
};
