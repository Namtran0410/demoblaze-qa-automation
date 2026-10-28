import IndexData from "@data/index"
import { test as base } from "@playwright/test"
import CartHelpers from "@infras/helpers/cart.helpers"
type CartFixture = {
    cartFixture: CartHelpers
}

export const test = base.extend<CartFixture>({
    cartFixture: async ({ page }, use) => {
        await use(new CartHelpers(page))
    },
})
