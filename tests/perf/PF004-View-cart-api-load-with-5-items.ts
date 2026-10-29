import http from "k6/http"
import { check, sleep } from "k6"
import exec from "k6/execution"
import { Options } from "k6/options"

const API_URL = __ENV.API_URL || "https://api.demoblaze.com"
const MAX_VUS = 10
// Every VU's cart holds this many lines while viewcart is measured
const ITEMS_IN_CART = 5

type SetupData = {
    runId: string
    productIds: number[]
}
type CartLine = {
    cookie: string
    id: string
    prod_id: number
}
const JSON_HEADER = {
    headers: {
        "Content-Type": "application/json",
    },
}

export const options: Options = {
    stages: [
        { duration: "1m", target: MAX_VUS },
        { duration: "3m", target: MAX_VUS },
        { duration: "1m", target: 0 },
    ],
    thresholds: {
        // Only viewcart is measured; filling the carts is tagged "seed"
        "http_req_duration{name:viewcart}": ["p(95)<1800"],
        "http_req_failed{name:viewcart}": ["rate<0.01"],
        checks: ["rate>0.99"],
    },
}

// Same rule in default and teardown, so teardown can find every VU's cart
function guestCookie(runId: string, vuId: number): string {
    return `user=${runId}-vu${vuId}`
}

export function setup(): SetupData {
    const res = http.get(`${API_URL}/entries`, { tags: { name: "entries" } })
    if (res.status !== 200) {
        exec.test.abort(`Get entries fail: ${res.body}`)
    }
    const items = res.json("Items") as { id: number }[]
    if (items.length < ITEMS_IN_CART) {
        exec.test.abort(`Need ${ITEMS_IN_CART} products, /entries returned ${items.length}`)
    }
    return {
        runId: crypto.randomUUID(),
        productIds: items.slice(0, ITEMS_IN_CART).map((item) => item.id),
    }
}

// Put the 5 products in this VU's cart, once, before it starts viewing
function fillCart(data: SetupData, cookie: string) {
    for (const productId of data.productIds) {
        const res = http.post(
            `${API_URL}/addtocart`,
            JSON.stringify({
                id: crypto.randomUUID(),
                cookie: cookie,
                prod_id: productId,
                flag: false,
            }),
            {
                ...JSON_HEADER,
                tags: { name: "seed" },
            },
        )
        if (res.status !== 200) {
            exec.test.abort(`Fill cart fail for ${cookie}: ${res.status} ${res.body}`)
        }
    }
}

export default function (data: SetupData) {
    const cookie = guestCookie(data.runId, exec.vu.idInTest)
    // A VU keeps its id for the whole test, so its cart only needs filling on its first iteration
    if (exec.vu.iterationInScenario === 0) {
        fillCart(data, cookie)
    }

    const res = http.post(`${API_URL}/viewcart`, JSON.stringify({ cookie: cookie, flag: false }), {
        ...JSON_HEADER,
        tags: { name: "viewcart" },
    })
    const lines = (res.status === 200 ? res.json("Items") : []) as CartLine[]
    check(res, {
        "view cart status 200": (r) => r.status === 200,
        [`cart has ${ITEMS_IN_CART} lines`]: () => lines.length === ITEMS_IN_CART,
        "cart has the seeded products": () =>
            data.productIds.every((productId) => lines.some((line) => line.prod_id === productId)),
    })
    sleep(1)
}

// Empty every VU's guest cart
export function teardown(data: SetupData) {
    for (let vuId = 1; vuId <= MAX_VUS; vuId++) {
        http.post(`${API_URL}/deletecart`, JSON.stringify({ cookie: guestCookie(data.runId, vuId) }), {
            ...JSON_HEADER,
            tags: { name: "deletecart" },
        })
    }
}
