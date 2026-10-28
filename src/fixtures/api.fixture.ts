import { test as base } from "@playwright/test"
import { IndexApi } from "@infras/api/index"

// API clients only need a request context, not a browser page
type ApiFixtures = {
    authApi: InstanceType<typeof IndexApi.authApi>
    cartApi: InstanceType<typeof IndexApi.cartApi>
}

export const test = base.extend<ApiFixtures>({
    authApi: async ({ request }, use) => {
        await use(new IndexApi.authApi(request))
    },
    cartApi: async ({ request }, use) => {
        await use(new IndexApi.cartApi(request))
    },
})
