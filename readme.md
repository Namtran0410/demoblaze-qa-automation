# demoblaze-qa-automation

Automated tests for [demoblaze.com](https://www.demoblaze.com), written with Playwright and TypeScript.

## Requirements

- [Node.js](https://nodejs.org/) 20 or later (the project is developed on Node 24)
- npm (installed with Node.js)
- Git

Check your versions:

```bash
node -v
npm -v
git --version
```

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Namtran0410/demoblaze-qa-automation.git
cd demoblaze-qa-automation

# 2. Install dependencies (use `npm install` if package-lock.json is missing)
npm ci

# 3. Download the Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. Linux only: install the system libraries the browsers need (requires sudo, WebKit will not start without them)
sudo npx playwright install-deps

# 5. Create the environment file
cp .env.example .env          # macOS / Linux
copy .env.example .env        # Windows (cmd)
```

Steps 3 and 4 can be combined into one command: `npx playwright install --with-deps`.

Then open `.env` and fill in `TEST_USERNAME` and `TEST_PASSWORD` with a demoblaze account (create one with **Sign up** on [demoblaze.com](https://www.demoblaze.com)). The Login and Cart tests need this account.

Check that everything works:

```bash
npm run typecheck
npm run test:chromium
```

## Environment variables

Variables are read from `.env`. Any variable that is not set falls back to its default.

| Variable        | Default                     | Used for                                       |
| --------------- | --------------------------- | ---------------------------------------------- |
| `BASE_URL`      | `https://www.demoblaze.com` | UI tests (projects chromium/firefox/webkit)    |
| `API_URL`       | `https://api.demoblaze.com` | API tests (project `api`)                      |
| `TEST_USERNAME` | _(empty)_                   | demoblaze account used by Login/Cart tests     |
| `TEST_PASSWORD` | _(empty)_                   | Password of that account                       |
| `CI`            | _(not set)_                 | Retries failed tests twice, blocks `test.only` |

## Running tests

| Command                 | What it does                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `npm test`              | Runs every project                                                                              |
| `npm run test:api`      | Runs only API tests (`*.api.spec.ts` files)                                                     |
| `npm run test:e2e`      | Runs UI tests on all 3 browsers (every file in `02.test` except `*.api.spec.ts` and `02.perf`) |
| `npm run test:chromium` | Runs UI tests on Chromium only                                                                  |
| `npm run test:headed`   | Runs on Chromium with a visible browser window                                                  |
| `npm run test:ui`       | Opens Playwright UI mode to run and debug tests                                                 |
| `npm run report`        | Opens the HTML report of the last run                                                           |
| `npm run typecheck`     | Checks for TypeScript errors                                                                    |

Run a single file, a single test, or a single browser:

```bash
npx playwright test 02.test/01.e2e/01.login/01.authentication.spec.ts
npx playwright test -g "LG-002"
npm test -- --grep "SMK-001" --project=firefox
```

Test titles start with the test case ID from `00.test_case/` (for example `LG-002 | Login with valid credentials`), so `-g "<ID>"` runs one case.

Every test saves a trace in `test-results/`, whether it passes or fails. When a test fails, a screenshot and video are saved there too. Open a trace with:

```bash
npx playwright show-trace <path to trace.zip>
```

## Project structure

```
00.test_case/          Test case suite (Excel: Summary, Login, Cart, Order sheets)
01.src/
  00.infras/
    00.pages/          Page objects (00.index.page.ts groups every page)
    01.helpers/        Reusable test steps built on the page objects
  01.business/         Business flows
  02.fixture/          Playwright fixtures (00.index.fixture.ts merges all of them)
  03.data/             Test data
  04.utils/            Utility functions
02.test/
  00.integration/      Integration tests (`*.api.spec.ts` files run in the `api` project, the rest run in the browsers)
  01.e2e/              UI tests, one folder per feature (01.login, 02.cart, 03.order)
  02.perf/             Performance tests (Playwright does not run this folder)
03.config/             Environment configuration (env.ts)
playwright.config.ts   Playwright configuration
```

Tests import `test` and `expect` from the merged fixture instead of `@playwright/test`:

```ts
import { test, expect } from "@fixture/00.index.fixture"
```

Path aliases can be used instead of relative paths: `@config/*`, `@infras/*`, `@business/*`, `@fixture/*`, `@data/*`, `@utils/*` (declared in `tsconfig.json`).
