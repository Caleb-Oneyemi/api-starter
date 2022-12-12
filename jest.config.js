module.exports = {
  displayName: 'api-starter',
  rootDir: './src',
  roots: ['./modules'],
  testMatch: ['**/__tests__/?(*.)+(test).ts'],
  verbose: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalSetup: './test/globalSetup.ts',
  setupFilesAfterEnv: ['./test/setup.ts'],
  globalTeardown: './test/globalTeardown.ts',
}
