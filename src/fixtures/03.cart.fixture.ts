import IndexData from "@data/00.index"
import { test as base } from "@playwright/test"
import { indexHelpers } from "@infras/helpers/00.index"
type CartFixture = {
    cartFixture: InstanceType<typeof indexHelpers.cartHelpers>
}

export const test = base.extend<CartFixture>({
    cartFixture: async ({ page }, use) => {
        await use(new indexHelpers.cartHelpers(page))
    },
})
