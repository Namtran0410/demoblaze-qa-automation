import { test, expect } from "@fixture/index"

test.describe("Cart | Cart modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })

    test("CT-009 | Cart table structure", async ({ cartFixture, mainFixture, productDataFixture }) => {
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await mainFixture.goToNav("Cart")
        await cartFixture.tableStructureVisible()
    })
    //TODO: PASSED
    test("CT-010 | Cart price matches product page price", async ({ cartFixture, mainFixture, productDataFixture }) => {
        await mainFixture.getProductPrice(productDataFixture.samsungGalaxyS6.name)
        const addToCartPrice = await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        const billPrice = await cartFixture.singlePriceInTable()
        expect(addToCartPrice).toEqual(billPrice)
    })
    //TODO: PASSED

    test("CT-011 | Products from different categories", async ({ cartFixture, mainFixture, productDataFixture }) => {
        const picks = [
            { category: "Phones", product: productDataFixture.samsungGalaxyS6 },
            { category: "Laptops", product: productDataFixture.sonyVaioI5 },
            { category: "Monitors", product: productDataFixture.appleMonitor24 },
        ] as const

        // Filter by each category and add one product from it
        const prices: number[] = []
        for (const { category, product } of picks) {
            await mainFixture.goto()
            await mainFixture.pages.main.category(category).click()
            prices.push(Number(await cartFixture.addProductToCart(product)))
        }

        // 3 rows, one per category, and the total is the sum of the 3 prices
        await cartFixture.addToCartSuccessful(picks.map((pick) => pick.product))
        const total = await cartFixture.cartTotalPrice()
        expect(Number(total)).toEqual(prices.reduce((sum, price) => sum + price, 0))
    })
    //TODO: PASSED
})
