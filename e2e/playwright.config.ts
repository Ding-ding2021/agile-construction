import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: 1,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1440, height: 900 },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -w src-next',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
