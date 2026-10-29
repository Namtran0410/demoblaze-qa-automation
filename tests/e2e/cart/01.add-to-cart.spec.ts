import { test, expect } from "@fixture/00.index"

test.describe("Cart | Cart modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })
    test("CT-001 | Guest adds a product to cart", async ({ cartFixture, productDataFixture }) => {
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED

    test("CT-002 | Logged-in user adds a product to cart", async ({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
    }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED
    test("CT-003 | Logged-in user Add multiple different products", async ({
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

        await cartFixture.addProductToCart(productDataFixture.Nokialumia1520)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6, productDataFixture.Nokialumia1520])
    })
    //TODO: PASSED
    test("CT-004 | Add the same product twice", async ({
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
    })
    //TODO: PASSED
    test("CT-015 | Add many items (10) or max", async ({ cartFixture }) => {
        // Adds every product shown on the home page (9, the first page of the list) one by one,
        // which can take longer than the default 30s under a parallel run
        test.slow()
        // true: only the first page of the home list
        const products = await cartFixture.addAllProductsToCart(true)
        expect(products).toHaveLength(9)

        await cartFixture.addToCartSuccessful(products)
        await cartFixture.cartTotalPrice()
    })
    //TODO: PASSED
    test("CT-017 | Rapid double-click 'Add to cart'", async ({
        cartFixture,
        productDataFixture,
        mainFixture,
        page,
    }) => {
        const s6 = productDataFixture.samsungGalaxyS6
        // Count every "Product added" alert and every add request, since a double-click can send one or two
        const addedAlerts: string[] = []
        page.on("dialog", async (dialog) => {
            if (dialog.message().includes("Product added")) addedAlerts.push(dialog.message())
            await dialog.accept()
        })
        let sent = 0
        let answered = 0
        page.on("request", (request) => {
            if (request.url().endsWith("/addtocart")) sent++
        })
        page.on("response", (response) => {
            if (response.url().endsWith("/addtocart")) answered++
        })

        await mainFixture.pages.main.product(s6.name).click()
        await cartFixture.navigateToAddingProductPage(s6)
        await cartFixture.pages.cart.addToCartButton.dblclick()

        // Wait until every add request has its answer and its alert
        await expect.poll(() => sent > 0 && answered === sent && addedAlerts.length === sent).toBeTruthy()

        // The number of rows equals the number of successful "Product added" alerts
        await cartFixture.addToCartSuccessful(Array(addedAlerts.length).fill(s6))
        await expect(cartFixture.pages.cart.cartRow(s6.name)).toHaveCount(addedAlerts.length)
        await cartFixture.cartTotalPrice()
    })
    //TODO: PASSED
})
