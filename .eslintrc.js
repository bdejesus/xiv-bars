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
    'class-methods-use-this': 'warn',
    'comma-dangle': 'off',
    'comma-spacing': 'warn',
    'linebreak-style': 'warn',
    'max-len': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unused-prop-types': 'warn',
    'react/no-unused-state': 'warn',
    'react/prop-types': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'quotes': 'warn'
  },
};
