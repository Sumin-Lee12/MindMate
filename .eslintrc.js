module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unused-imports/recommended',
    'prettier', // prettier와 충돌하는 ESLint 규칙 제거
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'import',
    'unused-imports',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 일반 규칙
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'unused-imports/no-unused-imports': 'warn',
    'prettier/prettier': 'warn',

    // import 정렬
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],

    // React Native 관련
    'react-native/no-inline-styles': 'off',
    'react-native/split-platform-components': 'off',
    'react-native/no-raw-text': 'off',
  },
};
