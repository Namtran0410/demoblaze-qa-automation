import { defineConfig, devices } from '@playwright/test';
import { env } from './03.config/env';

// API tests are marked by the *.api.spec.ts suffix, so every other spec under 02.test runs in the browsers.
// A project-level testIgnore replaces the top-level one, so perf is listed again
const apiTestMatch = '**/*.api.spec.ts';
const uiTestIgnore = [apiTestMatch, '02.perf/**'];

// Workers reload this config without the CLI args, so pass the headed flag on through an env var they inherit
if (process.argv.includes('--headed')) process.env.PW_HEADED = '1';
const isHeaded = !!process.env.PW_HEADED;

// Headed: open a maximized window that follows the screen size. Headless: keep the fixed 1280x720 viewport.
const chromiumUse = isHeaded
  ? {
      ...devices['Desktop Chrome'],
      viewport: null,
      deviceScaleFactor: undefined, // not allowed together with a null viewport
      launchOptions: { args: ['--start-maximized'] },
    }
  : devices['Desktop Chrome'];

// Firefox ignores --start-maximized and -width/-height, so headed runs use kiosk mode (fullscreen, no toolbar)
const firefoxUse = isHeaded
  ? {
      ...devices['Desktop Firefox'],
      viewport: null,
      deviceScaleFactor: undefined, // not allowed together with a null viewport
      launchOptions: { args: ['--kiosk'] },
    }
  : devices['Desktop Firefox'];

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
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'api',
      testMatch: apiTestMatch,
      use: { baseURL: env.apiUrl },
    },
    // UI projects pick up every spec under 02.test except *.api.spec.ts and perf tests
    {
      name: 'chromium',
      testIgnore: uiTestIgnore,
      use: chromiumUse,
    },
    {
      name: 'firefox',
      testIgnore: uiTestIgnore,
      use: firefoxUse,
    },
    {
      name: 'webkit',
      testIgnore: uiTestIgnore,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
