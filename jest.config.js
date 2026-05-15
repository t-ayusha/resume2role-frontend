export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          warnOnly: false,
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },

  // Prevent ts-jest from trying to run the d.ts helper as a Jest test suite
  testPathIgnorePatterns: ['/node_modules/', '\\.(d|spec)\\.ts$'],
};



