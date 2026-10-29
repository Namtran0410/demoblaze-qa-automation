import { indexHelpers } from "@infras/helpers/00.index"
import { test as base } from "@playwright/test"

export type OrderFixture = {
    orderFixture: InstanceType<typeof indexHelpers.orderHelpers>
}

export const test = base.extend<OrderFixture>({
    orderFixture: async ({ page }, use) => {
        await use(new indexHelpers.orderHelpers(page))
    },
})
