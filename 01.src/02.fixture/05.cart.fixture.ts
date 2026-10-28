import IndexData  from "@data/00.index.data";
import { test as base } from "@playwright/test";
import CartHelpers from "@infras/01.helpers/03.cart.helpers";
type CartFixture = {
    cartFixture: CartHelpers
}

export const test = base.extend<CartFixture>({
    cartFixture: async ({page}, use) => {
        await use(new CartHelpers(page))
    }
}) 