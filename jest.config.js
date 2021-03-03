module.exports = {
  verbose: true,
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '\\.(css|scss|csv)$': 'identity-obj-proxy',
    '\\.(svg|png)': '<rootDir>/tests/mocks/img.mock.js'
  }
};
