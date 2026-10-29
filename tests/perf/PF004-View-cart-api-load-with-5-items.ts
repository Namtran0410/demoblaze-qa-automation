import http from "k6/http"
import {check, sleep} from "k6"
import exec from "k6/execution"

const API_URL = __ENV.API_URL || "https://api.demoblaze.com"
const MAX_VUS = 10 
export const options = {
    stages: [
        {duration: "1m", target: MAX_VUS},
        {duration: "3m", target: MAX_VUS},
        {duration: "1m", target: 0}
    ],
    threshold: {
        "http_req_duration{name:viewcart}": ["p(95)<1200"],
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],
    }
}

