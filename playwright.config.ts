import { defineConfig, devices } from "@playwright/test"
import path from "node:path"
import dotenv from "dotenv"

// Load .env, then fill in defaults so process.env.BASE_URL / API_URL are always set (workers reload this file too)
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true })
process.env.BASE_URL ??= "https://www.demoblaze.com"
process.env.API_URL ??= "https://api.demoblaze.com"
const isCI = !!process.env.CI

// API tests are marked by the *.api.spec.ts suffix, so every other spec under tests runs in the browsers.
// A project-level testIgnore replaces the top-level one, so perf is listed again
const apiTestMatch = "**/*.api.spec.ts"
const uiTestIgnore = [apiTestMatch, "perf/**"]

// Workers reload this config without the CLI args, so pass the headed flag on through an env var they inherit
if (process.argv.includes("--headed")) process.env.PW_HEADED = "1"
const isHeaded = !!process.env.PW_HEADED

// Headed: open a maximized window that follows the screen size. Headless: keep the fixed 1280x720 viewport.
const chromiumUse = isHeaded
    ? {
          ...devices["Desktop Chrome"],
          viewport: null,
          deviceScaleFactor: undefined, // not allowed together with a null viewport
          launchOptions: { args: ["--start-maximized"] },
      }
    : devices["Desktop Chrome"]

// Firefox ignores --start-maximized and -width/-height, so headed runs use kiosk mode (fullscreen, no toolbar)
const firefoxUse = isHeaded
    ? {
          ...devices["Desktop Firefox"],
          viewport: null,
          deviceScaleFactor: undefined, // not allowed together with a null viewport
          launchOptions: { args: ["--kiosk"] },
      }
    : devices["Desktop Firefox"]

export default defineConfig({
    testDir: "./tests",
    testIgnore: "perf/**", // perf tests run with a dedicated tool, not Playwright
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 2 : undefined,
    timeout: 120_000,
    expect: { timeout: 15_000 },

    outputDir: "test-results",
    reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

    use: {
        baseURL: process.env.BASE_URL,
        trace: "on",
        screenshot: "on",
        video: "on",
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
    },

    projects: [
        {
            name: "api",
            testMatch: apiTestMatch,
            use: { baseURL: process.env.API_URL },
        },
        // UI projects pick up every spec under tests except *.api.spec.ts and perf tests
        {
            name: "chromium",
            testIgnore: uiTestIgnore,
            use: chromiumUse,
        },
        {
            name: "firefox",
            testIgnore: uiTestIgnore,
            use: firefoxUse,
        },
        {
            name: "webkit",
            testIgnore: uiTestIgnore,
            use: { ...devices["Desktop Safari"] },
        },
    ],
})
