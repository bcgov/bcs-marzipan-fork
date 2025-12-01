// @ts-check

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Global ignores
  {
    ignores: [
      'eslint.config.mjs',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      '.local/**',
      '**/*.md',
    ],
  },

  // Base recommended configs
  eslint.configs.recommended,
  // TypeScript recommended configs (non-type-checked for base)
  // Type-checked configs are applied in specific file configs below that have parserOptions
  ...tseslint.configs.recommended,

  // Calendar Service (NestJS) specific config - adopting Nest.js defaults
  // Excludes scripts directory which has its own config below
  // Apply type-checked configs for calendar-service
  ...tseslint.configs.recommendedTypeChecked.map((config) => {
    const baseConfig = config;
    // @ts-expect-error - languageOptions may exist on config but TypeScript doesn't know
    const existingLanguageOptions = baseConfig.languageOptions || {};
    return {
      ...baseConfig,
      // Explicitly override files to ensure we only match calendar-service files
      files: ['calendar-service/**/*.ts', '!calendar-service/scripts/**/*.ts'],
      languageOptions: {
        ...existingLanguageOptions,
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: 'commonjs',
        parserOptions: {
          project: ['./calendar-service/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    };
  }),
  {
    files: ['calendar-service/**/*.ts', '!calendar-service/scripts/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: ['./calendar-service/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Nest.js default rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Disable unsafe rules for Nest.js - ExecutionContext.getRequest() returns 'any' by design
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  // Calendar Service scripts - basic linting without type checking
  {
    files: ['calendar-service/scripts/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Calendar UI (React) specific config
  // Apply type-checked configs for calendar-ui
  ...tseslint.configs.recommendedTypeChecked.map((config) => {
    const baseConfig = config;
    // @ts-expect-error - languageOptions may exist on config but TypeScript doesn't know
    const existingLanguageOptions = baseConfig.languageOptions || {};
    return {
      ...baseConfig,
      // Explicitly override files to ensure we only match calendar-ui files
      files: ['calendar-ui/**/*.ts', 'calendar-ui/**/*.tsx'],
      languageOptions: {
        ...existingLanguageOptions,
        globals: {
          ...globals.browser,
          ...globals.es2021,
        },
        sourceType: 'module',
        parserOptions: {
          project: ['./calendar-ui/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    };
  }),
  {
    files: ['calendar-ui/**/*.ts', 'calendar-ui/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      sourceType: 'module',
      parserOptions: {
        project: ['./calendar-ui/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React-specific rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // TypeScript rules for React files
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // TODO: TEMPORARY RULES - Remove these rules after fixing `any` type issues
      // These rules are temporarily disabled to silence linting errors related to `any` types
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      // END TEMPORARY RULES - Remove the above
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Packages (database, shared) - type-checked configs
  // Apply type-checked configs for packages/database
  ...tseslint.configs.recommendedTypeChecked.map((config) => {
    const baseConfig = config;
    // @ts-expect-error - languageOptions may exist on config but TypeScript doesn't know
    const existingLanguageOptions = baseConfig.languageOptions || {};
    return {
      ...baseConfig,
      // Explicitly override files to ensure we only match packages/database files
      files: ['packages/database/**/*.ts'],
      languageOptions: {
        ...existingLanguageOptions,
        globals: {
          ...globals.node,
        },
        sourceType: 'module',
        parserOptions: {
          project: ['./packages/database/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    };
  }),
  // Apply type-checked configs for packages/shared
  ...tseslint.configs.recommendedTypeChecked.map((config) => {
    const baseConfig = config;
    // @ts-expect-error - languageOptions may exist on config but TypeScript doesn't know
    const existingLanguageOptions = baseConfig.languageOptions || {};
    return {
      ...baseConfig,
      // Explicitly override files to ensure we only match packages/shared files
      files: ['packages/shared/**/*.ts'],
      languageOptions: {
        ...existingLanguageOptions,
        globals: {
          ...globals.node,
        },
        sourceType: 'module',
        parserOptions: {
          project: ['./packages/shared/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    };
  }),

  // Prettier integration (must be last to override formatting rules)
  // eslint-plugin-prettier/recommended includes both prettier plugin and disables conflicting rules
  eslintPluginPrettierRecommended,
];
