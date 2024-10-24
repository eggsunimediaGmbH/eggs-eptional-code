module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', "import"],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  ignorePatterns: ['dist/', 'node_modules/', '**/*.js'],
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      jsx: 'never',
      js: 'never',
      ts: 'never',
      tsx: 'never'
    }],
  },
};
