import { browser } from "k6/browser"
import { check } from "k6"
import { Options } from "k6/options"

const BASE_URL = __ENV.BASE_URL || "https://www.demoblaze.com"

export const options: Options = {
    scenarios: {
        // browser profile: 1 VU, 5 iterations, Chromium
        homeWebVitals: {
            executor: "per-vu-iterations",
            vus: 1,
            iterations: 5,
            options: {
                browser: { type: "chromium" },
            },
        },
    },
    thresholds: {
        browser_web_vital_lcp: ["p(75)<2500"],
        browser_web_vital_fcp: ["p(75)<1800"],
        browser_web_vital_cls: ["p(75)<0.1"],
        browser_web_vital_ttfb: ["p(75)<800"],
        checks: ["rate>0.99"],
    },
}

// Open Home -> wait for the product cards -> open the Log in modal
export default async function () {
    // A new context per iteration: empty cache and cookies, like a first visit
    const context = await browser.newContext()
    const page = await context.newPage()
    try {
        await page.goto(BASE_URL)
        // Products come from the API after the page loads
        await page.locator("#tbodyid .card").first().waitFor({ state: "visible" })

        await page.locator("#login2").click()
        await page.locator("#logInModal").waitFor({ state: "visible" })
        check(await page.locator("#logInModal .modal-title").textContent(), {
            "Log in modal opens": (title) => title?.trim() === "Log in",
        })
    } finally {
        // Closing the page reports the Web Vitals collected so far (CLS is only final then)
        await page.close()
        await context.close()
    }
}
