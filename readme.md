# demoblaze-qa-automation

Automated tests for [demoblaze.com](https://www.demoblaze.com), written with Playwright and TypeScript.
Runs on Windows, Linux and macOS.

## Requirements

- [Node.js](https://nodejs.org/) 20 or later (the project is developed on Node 24)
- npm (installed with Node.js)
- Git

### Install the requirements

**Windows** (PowerShell):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

Or download the installers from [nodejs.org](https://nodejs.org/) and [git-scm.com](https://git-scm.com/). Close and reopen the terminal afterwards so `node` and `git` are found.

**Linux** (Ubuntu / Debian):

```bash
sudo apt-get update
sudo apt-get install -y git curl
# Node.js 24 from NodeSource (the Ubuntu package is often too old)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS**: `brew install node git`, or use the installers above.

Check your versions (any OS):

```bash
node -v
npm -v
git --version
```

## Installation

### 1. Get the code and the dependencies (any OS)

```bash
git clone https://github.com/Namtran0410/demoblaze-qa-automation.git
cd demoblaze-qa-automation
npm ci
```

`npm ci` installs the exact versions in `package-lock.json`. Use `npm install` if that file is missing.

### 2. Install the browsers

**Windows / macOS**:

```bash
npx playwright install
```

**Linux**: the browsers also need system libraries, which require `sudo`. Without them WebKit fails to start with `Host system is missing dependencies to run browsers`.

```bash
npx playwright install --with-deps
```

`--with-deps` asks for your password and installs both the browsers and the libraries. If the browsers are already downloaded, `sudo npx playwright install-deps` installs only the libraries. Playwright supports Ubuntu and Debian; on other distributions install the libraries it lists with your package manager.

### 3. Create the environment file

| Shell              | Command                       |
| ------------------ | ----------------------------- |
| Linux / macOS      | `cp .env.example .env`        |
| Windows PowerShell | `Copy-Item .env.example .env` |
| Windows cmd        | `copy .env.example .env`      |

The defaults in `.env.example` point at the public demoblaze site, so nothing needs to be edited to run the tests.

### 4. Check that everything works

```bash
npm run typecheck
npx playwright test --grep "SMK-001"
```

The second command runs the smoke test on every browser. It should report all passed.

### Windows: `running scripts is disabled on this system`

PowerShell blocks the `npm` / `npx` script shims by default. Either run the commands in **cmd** instead, or allow local scripts once for your user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Environment variables

Variables are read from `.env` by `playwright.config.ts` and used in code as `process.env.<NAME>`. If `BASE_URL` or `API_URL` is not set, it falls back to its default.

| Variable        | Default                     | Used for                                       |
| --------------- | --------------------------- | ---------------------------------------------- |
| `BASE_URL`      | `https://www.demoblaze.com` | UI tests (projects chromium/firefox/webkit)    |
| `API_URL`       | `https://api.demoblaze.com` | API tests (project `api`)                      |
| `CI`            | _(not set)_                 | Retries failed tests twice, blocks `test.only` |
| `TEST_USERNAME` | _(empty)_                   | Not used yet                                   |
| `TEST_PASSWORD` | _(empty)_                   | Not used yet                                   |

You do not need your own demoblaze account: tests that need one register a fresh account through the API (the `account` fixture in `src/fixtures/05.business.fixture.ts`).

## Running tests

| Command                 | What it does                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `npm test`              | Runs every project                                                                        |
| `npm run test:api`      | Runs only API tests (`*.api.spec.ts` files)                                               |
| `npm run test:e2e`      | Runs UI tests on all 3 browsers (every file in `tests` except `*.api.spec.ts` and `perf`) |
| `npm run test:chromium` | Runs UI tests on Chromium only                                                            |
| `npm run test:headed`   | Runs on Chromium with a visible browser window                                            |
| `npm run test:ui`       | Opens Playwright UI mode to run and debug tests                                           |
| `npm run report`        | Opens the HTML report of the last run                                                     |
| `npm run typecheck`     | Checks for TypeScript errors                                                              |

Run a single file, a single test, or a single browser. Calling `npx playwright test` directly works the same in every shell:

```bash
npx playwright test tests/e2e/login/02.authentication.spec.ts
npx playwright test --grep "LG-002"
npx playwright test --grep "SMK-001" --project=firefox --headed
```

Test titles start with the test case ID from `test-cases/` (for example `LG-002 | Login with valid credentials`), so `--grep "<ID>"` runs one case. Use the IDs from the `TC ID` column of the Excel file.

> `npm test -- --grep "<ID>"` also works in bash and cmd, but Windows PowerShell can drop the `--` and pass the options to npm instead. Prefer `npx playwright test ...` there.

### Number of workers

Playwright runs tests in parallel with one worker per half of your CPU cores. Use **at most 8 workers**: with more, the machine and the public demoblaze site get overloaded and tests start failing on timeouts (WebKit is the most sensitive). The full suite (128 tests, 3 browsers + API) was checked stable with 6 workers, three runs in a row, about 3.5 minutes each.

```bash
npx playwright test --workers=6
```

On a machine with few cores (4 or fewer), or if some UI tests time out, lower it further, e.g. `--workers=4`.

With `--headed`, Chromium opens maximized and Firefox opens fullscreen (kiosk mode, close it with `Alt+F4`). Without it, browsers run hidden at 1280x720.

Every test saves a trace, a screenshot and a video in `test-results/`. This folder is emptied at the start of every run, so copy what you need before running again. Open a trace with:

```bash
npx playwright show-trace <path to trace.zip>
```

### Known defects

Some tests are marked `test.fail(...)` because demoblaze has a confirmed bug (for example LG-016, LG-021). They show as passed while the bug is still there. When the site is fixed, Playwright reports them as "expected to fail but passed": remove the `test.fail` line then.

## Project structure

```
test-cases/            Test case suite (Excel: Summary, Login, Cart, Order sheets)
src/
  infras/
    pages/             Page objects: locators only (00.index.ts groups every page)
    helpers/           Reusable UI steps built on the page objects
    api/               API clients, one per endpoint group (00.index.ts groups them)
  business/            Business flows that span several pages or mix UI and API (e.g. account creation)
  fixtures/            Playwright fixtures (00.index.ts merges all of them)
  data/                Test data
  types/               Shared TypeScript types
  utils/               Utility functions
tests/
  integration/         Integration tests (`*.api.spec.ts` files run in the `api` project, the rest run in the browsers)
  e2e/                 UI tests, one folder per feature (login, cart, order)
  perf/                Performance tests (Playwright does not run this folder)
playwright.config.ts   Playwright configuration (also loads `.env`)
```

### Naming

- Files and folders are kebab-case: `01.login-modal.spec.ts`, `01.api-account-creator.ts`.
- Every `.ts` file starts with a two-digit number: `00.` is always the `index.ts`; the other files follow from `01.`
  in flow order (base, main, auth, cart, order), and spec files in test case ID order.
- Apart from the number prefix, a dot only marks what kind of file it is: `.page.ts`, `.helpers.ts`, `.api.ts`, `.fixture.ts`, `.spec.ts`.
  `*.api.spec.ts` is also how Playwright tells API tests from UI tests, so keep that suffix for API tests only.
- Each folder that groups several modules has a `00.index.ts`; import it explicitly, e.g. `@infras/pages/00.index`.
- Test order comes from the test case ID in the title (`LG-001`, `CT-005`, ...), not from file names.

Tests import `test` and `expect` from the merged fixture instead of `@playwright/test`:

```ts
import { test, expect } from "@fixture/00.index"
```

Path aliases can be used instead of relative paths: `@infras/*`, `@business/*`, `@fixture/*`, `@data/*`, `@utils/*`, `@type/*` (declared in `tsconfig.json`).
