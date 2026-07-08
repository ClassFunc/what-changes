const github = require('eslint-plugin-github').default
const jestPlugin = require('eslint-plugin-jest')
const babelParser = require('@babel/eslint-parser')
const globals = require('globals')

module.exports = [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/lib/**',
      '*.json'
    ]
  },
  // Recommended configuration from github plugin
  github.getFlatConfigs().recommended,
  // Custom config for JS files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['jest']
        }
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.commonjs,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-commonjs': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      semi: 'off'
    }
  },
  // Jest configuration for test files
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules
    }
  }
]
