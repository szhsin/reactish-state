const config = require('../.eslintrc');

module.exports = {
  ...config,
  extends: [...config.extends, 'plugin:@next/next/recommended'],
  rules: {
    ...config.rules,
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
    'no-console': 0
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        'react-hooks/exhaustive-deps': [
          'warn',
          {
            additionalHooks: 'useSelector'
          }
        ]
      }
    }
  ]
};
