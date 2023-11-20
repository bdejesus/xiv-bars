import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/__mocks__/db.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

// export const jestConfig = {
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
//   testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//   moduleNameMapper: {
//     '\\.(scss|sass|css)$': 'identity-obj-proxy',
//   },
// };

// export default jestConfig;
