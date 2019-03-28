module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react'
  ],
  rules: {
    'comma-dangle': 'off',
    'react/destructuring-assignment': 'warn',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'warn',
    'react/no-unused-state': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off'

  },
};
