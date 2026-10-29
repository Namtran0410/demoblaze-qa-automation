import http from "k6/http"
import { check, sleep } from "k6"
import exec from "k6/execution"

const API_URL = __ENV.API_URL || "https://api.demoblaze.com"
const MAX_VUS = 10

export const options = {
    stages: [
        { duration: "1m", target: MAX_VUS },
        { duration: "3m", target: MAX_VUS },
        { duration: "1m", target: 0 },
    ],
    thresholds: {
        "http_req_duration{name:addtocart}": ["p(95)<1200"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],
    },
}

type SetupData = {
    runId: string
    productId: number
}

const JSON_HEADER = {
    headers: {
        "Content-Type": "application/json",
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
    return {
        runId: crypto.randomUUID(),
        productId: res.json("Items.0.id") as number,
    }
}

export default function (data: SetupData) {
    const res = http.post(
        `${API_URL}/addtocart`,
        JSON.stringify({
            id: crypto.randomUUID(), // new cart line every time
            cookie: guestCookie(data.runId, exec.vu.idInTest), // own cart per VU
            prod_id: data.productId,
            flag: false,
        }),
        {
            ...JSON_HEADER,
            tags: { name: "addtocart" },
        },
    )
    check(res, {
        "add to cart status 200": (r) => r.status === 200,
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
