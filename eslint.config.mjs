import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      'next-env.d.ts', 
      '**/*.d.ts', 
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
      '**/*.cjs',
      '**/*.js',
      '!jest.config.*',
      '!jest.setup.*',
      '!**/*.test.*',
      '!**/*.spec.*'
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': nextPlugin,
    },
    rules: {
      // Next.js rules
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      // TypeScript rules
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      // Disable base JS rules in TS files to avoid duplicate/incorrect diagnostics.
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.test.*', '**/*.spec.*', 'jest.setup.*', 'jest.config.*'],
    ignores: [
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.js'],
    ignores: [
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  
  // Ensure Node globals are recognized in ESM config files like next.config.mjs
  {
    files: ['**/*.mjs'],
    ignores: [
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.test.*', '**/*.spec.*', 'jest.setup.*', 'jest.config.*'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];