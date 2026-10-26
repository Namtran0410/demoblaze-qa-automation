import { defineConfig, devices } from '@playwright/test';
import { env } from './03.config/env';

export default defineConfig({
  testDir: './02.test',
  testIgnore: '02.perf/**', // perf tests run with a dedicated tool, not Playwright
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  workers: env.isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'api',
      testDir: './02.test/00.integration',
      use: { baseURL: env.apiUrl },
    },
    {
      name: 'chromium',
      testDir: './02.test/01.e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './02.test/01.e2e',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testDir: './02.test/01.e2e',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
