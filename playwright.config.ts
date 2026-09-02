import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playground/tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4410', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run playground',
    url: 'http://localhost:4410',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
