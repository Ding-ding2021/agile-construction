import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // === 质量防线 ===
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // === 技术债务：禁止硬编码渐变 ===
      // 渐变应通过主题变量或 CSS 类管理，禁止在 TS/TSX 中直接写死
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/linear-gradient|radial-gradient/]',
          message: '🎨 禁止硬编码 CSS 渐变。请使用主题变量或抽离到 CSS 类中。',
        },
        {
          selector: 'TemplateElement[value.raw=/linear-gradient|radial-gradient/]',
          message: '🎨 禁止硬编码 CSS 渐变。请使用主题变量或抽离到 CSS 类中。',
        },
      ],

      // === 技术债务：禁止已知重复类名前缀 ===
      // 项目已统一为 stat-blue / stat-green 等，禁止再引入 pm-stat-*/tm-stat-*
      'no-restricted-properties': [
        'error',
        {
          object: 'className',
          property: 'pm-stat-blue',
          message: '🏷️ .pm-stat-blue 已废弃，请使用 .stat-blue',
        },
        {
          object: 'className',
          property: 'tm-stat-blue',
          message: '🏷️ .tm-stat-blue 已废弃，请使用 .stat-blue',
        },
      ],

      // === React 规范 ===
      'react-hooks/exhaustive-deps': 'warn',

      // === TypeScript 严格 ===
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
])
