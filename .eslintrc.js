module.exports = {
  env: {
    'jest/globals': true,
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'jest'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'no-console': 'error',
    'import/no-default-export': 'error',
    'import/extensions': [
      'error',
      {
        js: 'never',
        ts: 'never',
        json: 'allow',
      },
    ],

    /**
     * The following rules conflict with TypeScript
     */
    '@typescript-eslint/no-unused-vars': 2,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
