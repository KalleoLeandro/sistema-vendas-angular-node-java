import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        '**/__tests__/**',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        '**/*.mock.{js,ts}',
        '**/setupTests.{js,ts}',
        'src/main.{js,ts,jsx,tsx}',
        'src/**/*.d.ts',
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'vite.config.{js,ts}',
        'eslint.config.js'
      ]
    }
    ,
    setupFiles: './src/setupTests.ts',

  },
  server: {
    port: 4000,
  }
})
