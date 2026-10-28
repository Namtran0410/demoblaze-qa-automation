import { test, expect } from "@fixture/index"

test.describe("Cart | Cart modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })

    test("CT-005 | Delete one item from cart", async ({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture,
    }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)

        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])

        await cartFixture.deleteSingleProduct(productDataFixture.samsungGalaxyS6)
    })
    //TODO: PASSED
    test("CT-006 | Delete all items from cart", async ({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture,
    }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)

        await mainFixture.goToNav("Home (current)")

        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)

        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6, productDataFixture.samsungGalaxyS6])

        await cartFixture.deleteAllItem()
    })
    //TODO: PASSED
    test("CT-016 | Delete one of two identical rows", async ({ cartFixture, productDataFixture, mainFixture }) => {
        const s6 = productDataFixture.samsungGalaxyS6
        // The data holds the product page text "$360 *includes tax"; the cart shows the bare number "360"
        const cartPrice = s6.price.replace(/\D/g, "")

        // Adds 1 item 2 times; addProductToCart starts from the home page, so go back there in between
        await cartFixture.addProductToCart(s6)
        await mainFixture.goto()
        await cartFixture.addProductToCart(s6)

        // Opens the Cart and checks both rows are there
        await cartFixture.addToCartSuccessful([s6, s6])

        // delete 1 item: exactly 1 row remains and the total is the price of one
        await cartFixture.deleteSingleProduct(s6)
        await expect(cartFixture.pages.cart.cartRow(s6.name)).toHaveCount(1)
        await expect(cartFixture.pages.cart.cartTotal).toHaveText(cartPrice)
    })
    //TODO: PASSED
})
