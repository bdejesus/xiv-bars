export const jestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
};

export default jestConfig;
