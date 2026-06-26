import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'ai_adoption_dashboard_v2.jsx']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser, __BUILD_ID__: 'readonly', __BUILD_DATE__: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Node entrypoints (Express server, build/config files).
  {
    files: ['server.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
])
