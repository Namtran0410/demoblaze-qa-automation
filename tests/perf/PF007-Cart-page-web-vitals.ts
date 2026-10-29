import { browser } from "k6/browser"
import http from "k6/http"
import { check } from "k6"
import exec from "k6/execution"
import { Trend } from "k6/metrics"
import { Options } from "k6/options"

const BASE_URL = __ENV.BASE_URL || "https://www.demoblaze.com"
const API_URL = __ENV.API_URL || "https://api.demoblaze.com"
const ITEMS_IN_CART = 3

// Navigation start -> last cart row and the total rendered (true: the values are times)
const cartRenderTime = new Trend("cart_render_time", true)

type SetupData = {
    productIds: number[]
}
const JSON_HEADER = {
    headers: {
        "Content-Type": "application/json",
    },
}

export const options: Options = {
    scenarios: {
        // browser profile: 1 VU, 5 iterations, Chromium
        cartWebVitals: {
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
        cart_render_time: ["p(75)<4000"],
        checks: ["rate>0.99"],
    },
}

export function setup(): SetupData {
    const res = http.get(`${API_URL}/entries`, { tags: { name: "entries" } })
    if (res.status !== 200) {
        exec.test.abort(`Get entries fail: ${res.body}`)
    }
    const products = res.json("Items") as { id: number }[]
    return { productIds: products.slice(0, ITEMS_IN_CART).map((product) => product.id) }
}

// Seed a fresh guest cart with 3 items via API, then open the Cart page with that guest's cookie
export default async function (data: SetupData) {
    // The page sends its whole cookie string ("user=<id>") as the cart owner, so the API seed uses the same string
    const userId = crypto.randomUUID()
    const cookie = `user=${userId}`
    const lineIds: string[] = []
    for (const productId of data.productIds) {
        const lineId = crypto.randomUUID()
        const res = http.post(
            `${API_URL}/addtocart`,
            JSON.stringify({ id: lineId, cookie: cookie, prod_id: productId, flag: false }),
            { ...JSON_HEADER, tags: { name: "seed" } },
        )
        if (res.status !== 200) {
            exec.test.abort(`Seed cart fail: ${res.status} ${res.body}`)
        }
        lineIds.push(lineId)
    }

    const context = await browser.newContext()
    await context.addCookies([{ name: "user", value: userId, url: BASE_URL }])
    const page = await context.newPage()
    try {
        const start = Date.now()
        await page.goto(`${BASE_URL}/cart.html`)
        // Rows come from /viewcart and one /view per line; the total is written after them
        await page.waitForFunction(
            (expected: number) =>
                document.querySelectorAll("#tbodyid tr").length === expected &&
                (document.getElementById("totalp")?.textContent ?? "").trim() !== "",
            { polling: "raf", timeout: 30000 },
            ITEMS_IN_CART,
        )
        cartRenderTime.add(Date.now() - start)

        check(await page.locator("#tbodyid tr").count(), {
            [`cart shows ${ITEMS_IN_CART} rows`]: (rows) => rows === ITEMS_IN_CART,
        })
    } finally {
        // Closing the page reports the Web Vitals collected so far (CLS is only final then)
        await page.close()
        await context.close()
        // Leave the guest cart empty
        for (const lineId of lineIds) {
            http.post(`${API_URL}/deleteitem`, JSON.stringify({ id: lineId }), {
                ...JSON_HEADER,
                tags: { name: "cleanup" },
            })
        }
    }
}
