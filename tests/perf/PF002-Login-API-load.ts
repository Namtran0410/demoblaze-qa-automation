import http from "k6/http"
import {check, sleep } from "k6"
import {b64encode} from "k6/encoding"
import exec from "k6/execution"

const API_URL = __ENV.API_URL || "https://api.demoblaze.com"

export const options = {
    stages: [
        {duaration: "1m", target: 10},
        {duration: "3m", target: 10},
        {duration: "1m", target: 0}
    ],
    thresholds: {
        "http_req_duration{name:login}": ["p(95)<1200"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],
    }
}

type Account = {
    username: string, 
    password: string
}

const JSON_HEADER = {
    headers: {
        "Content-Type": "application/json"
    }
}

export function setup(): Account {
    const account = {
        username: `k6perf_${Date.now()}`,
        password: b64encode("Perf@12345")
    }
    const res = http.post(
        `${API_URL}/signup`,
        JSON.stringify(account),
        {
            headers: JSON_HEADER.headers,
            tags: {name: "signup"}
        }
    )
    if(res.status !== 200 || res.body?.toString().includes("errorMessage")) {
        exec.test.abort(`SignUp fail: ${res.body}`)
    }
    return account
}

export default function(account: Account) {
    const res = http.post(
        `${API_URL}/login`, 
        JSON.stringify(account),
        {
            headers: JSON_HEADER.headers,
            tags: {name: "login"}
        }
    )
    check(res, {
        "login status 200": (r)=> r.status === 200,
        "body got auth_token": (r)=> String(r.json()).startsWith("Auth_token:")
    })
    sleep(1)
}