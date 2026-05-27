/**
 * Autonomous ESLint Rules — Custom Linter
 *
 * This config extends the project's base ESLint rules and adds
 * autonomous guards for patterns that default rules miss.
 *
 * Used exclusively by automation/type-coverage-enforcer.cjs and
 * .github/workflows/custom-eslint.yml for CI gate.
 */

const path = require('path');

module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports'
  ],
  rules: {
    // ---- Autonomous guard rules ----

    // Forbidden APIs — no eval or Function constructor
    'no-eval': 'error',
    'no-new-func': 'error',

    // innerHTML requires explicit sanitization (hard to enforce; at least flag)
    'no-inner-html': 'error',

    // Async error handling — ensure promises are catch-handled or try/catch
    'require-async-try-catch': 'error',

    // Console statements in production code
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Enforce explicit any prohibition
    '@typescript-eslint/no-explicit-any': ['error', {
      fixToUnknown: false,
      ignoreRestParams: false,
      ignoreRestArrays: false
    }],

    // Ensure await on promise calls (simple heuristic)
    'require-await': 'warn',

    // Unused variables/imports
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],

    // Naming conventions
    camelcase: ['error', { properties: 'always' }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'function',
        format: ['camelCase']
      },
      {
        selector: 'parameter',
        format: ['camelCase']
      },
      {
        selector: 'property',
        format: ['camelCase', 'snake_case', 'UPPER_CASE']
      },
      {
        selector: 'memberLike',
        format: ['camelCase']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }
    ],

    // Require explicit return types on exported functions (future enhancement)
    // '@typescript-eslint/explicit-function-return-type': ['error', {
    //   allowExpressions: true,
    //   allowHigherOrderFunctions: true,
    //   allowTypedFunctionExpressions: true
    // }],

    // Complexity guard
    'complexity': ['warn', 20],

    // Enforce braces on conditionals
    curly: ['error', 'all'],

    // No magic numbers (with allowlist)
    'no-magic-numbers': ['warn', {
      ignore: [0, 1, -1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000, 1024, 60, 3600, 86400],
      ignoreArrayIndexes: true,
      ignore: [
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,  // small integers ok
        12, 24, 48, 60, 100, 1024, 86400     // common constants ok
      ]
    }]
  },
  overrides: [
    {
      files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off' // tests may use any liberally
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    'coverage/',
    '.hermes/',
    'automation/reports/',
    '**/*.config.js',
    '**/*.config.cjs',
    'scripts/automation/**',
    'automation/**/*.cjs', // allow automation scripts to be less strict
    'eslint-rules/**' // custom plugin dir itself excluded
  ]
};
