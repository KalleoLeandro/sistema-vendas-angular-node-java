import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',  // Usa ts-jest para suportar TypeScript
  testEnvironment: 'node', // Ambiente de teste
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  reporters: [
    'default',
    ['jest-sonar', {
      outputDirectory: 'coverage',
      outputName: 'sonar-report.xml',
      reportedFilePath: 'relative',
      relativeRootDir: './src',
    }]
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    "^@routes/(.*)$": '<rootDir>/src/routes/$1',
    "^@errors/(.*)$": '<rootDir>/src/errors/$1',
    "^@middlewares/(.*)$": '<rootDir>/src/middlewares/$1',
    "^@models/(.*)$": '<rootDir>/src/models/$1',
    "^@environments/(.*)$": '<rootDir>/src/environments/$1',
  }
};

export default config;