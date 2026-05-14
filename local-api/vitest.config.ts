import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    root: __dirname,
    globals: true,
    environment: 'node',
    setupFiles: './test/setup.ts',
    testTimeout: 10000,
    hookTimeout: 15000,
    include: ['test/**/*.test.ts'],
    fileParallelism: false,
  },
})
