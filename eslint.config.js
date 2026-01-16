import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig(
  //dist 폴더 등 검사 제외 폴더
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'], // react-in-jsx-scope: off 효과
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node, // env: node : true 효과
      },
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' }, // 리액트 버전 자동 감지 필수
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-var': 'error', // var 금지
      '@typescript-eslint/no-unused-vars': 'warn', // 미사용 변수 경고
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error', // Prettier 위반 시 에러 처리
      'react/react-in-jsx-scope': 'off', // 최신 리액트에서는 필수 아님
    },
  },
  eslintConfigPrettier, // 마지막에 배치하여 포맷팅 관련 규칙 충돌 방지
);
