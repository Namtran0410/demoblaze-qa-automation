import http from "k6/http"
import { check, sleep } from "k6"
import exec from "k6/execution"
import { Options } from "k6/options"

const API_URL = __ENV.API_URL || "https://api.demoblaze.com"
const MAX_VUS = 10

type SetupData = {
    runId: string
    productId: number
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
        // Each endpoint p(95) < 1800 ms
        "http_req_duration{name:addtocart}": ["p(95)<1800"],
        "http_req_duration{name:viewcart}": ["p(95)<1800"],
        "http_req_duration{name:deleteitem}": ["p(95)<1800"],
        // One whole journey (4 requests + 1s sleep)
        iteration_duration: ["p(95)<6000"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],
    },
}

// Same rule in default and teardown, so teardown can find every VU's cart
function guestCookie(runId: string, vuId: number): string {
    return `user=${runId}-vu${vuId}`
}

function viewCart(cookie: string): CartLine[] {
    const res = http.post(`${API_URL}/viewcart`, JSON.stringify({ cookie: cookie, flag: false }), {
        ...JSON_HEADER,
        tags: { name: "viewcart" },
    })
    return (res.status === 200 ? res.json("Items") : []) as CartLine[]
}

export function setup(): SetupData {
    const res = http.get(`${API_URL}/entries`, { tags: { name: "entries" } })
    if (res.status !== 200) {
        exec.test.abort(`Get entries fail: ${res.body}`)
    }
    return {
        runId: crypto.randomUUID(),
        productId: res.json("Items.0.id") as number,
    }
}

// add -> view (item present) -> delete -> view (item gone); the cart is empty again after each iteration
export default function (data: SetupData) {
    const cookie = guestCookie(data.runId, exec.vu.idInTest)
    const lineId = crypto.randomUUID()

    const added = http.post(
        `${API_URL}/addtocart`,
        JSON.stringify({ id: lineId, cookie: cookie, prod_id: data.productId, flag: false }),
        { ...JSON_HEADER, tags: { name: "addtocart" } },
    )
    if (!check(added, { "add to cart status 200": (r) => r.status === 200 })) {
        sleep(1)
        return
    }

    const afterAdd = viewCart(cookie)
    check(afterAdd, { "cart has the added item": (lines) => lines.some((line) => line.id === lineId) })

    const deleted = http.post(`${API_URL}/deleteitem`, JSON.stringify({ id: lineId }), {
        ...JSON_HEADER,
        tags: { name: "deleteitem" },
    })
    check(deleted, { "delete item status 200": (r) => r.status === 200 })

    const afterDelete = viewCart(cookie)
    check(afterDelete, { "deleted item is gone": (lines) => !lines.some((line) => line.id === lineId) })

    sleep(1)
}

// Empty every VU's guest cart, in case an iteration stopped before its delete
export function teardown(data: SetupData) {
    for (let vuId = 1; vuId <= MAX_VUS; vuId++) {
        http.post(`${API_URL}/deletecart`, JSON.stringify({ cookie: guestCookie(data.runId, vuId) }), {
            ...JSON_HEADER,
            tags: { name: "deletecart" },
        })
    }
}
