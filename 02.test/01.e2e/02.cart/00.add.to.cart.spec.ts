import {test, expect} from "@fixture/00.index.fixture"

test.describe("Cart | Cart modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    test("CT-001 | Guest adds a product to cart", async({
        cartFixture,
        productDataFixture
    })=>{
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED

    test("CT-002 | Logged-in user adds a product to cart", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account
    })=>{
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED
    test("CT-003 | Logged-in user Add multiple different products", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture
    })=>{
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        
        await mainFixture.goToNav("Home (current)")

        await cartFixture.addProductToCart(productDataFixture.Nokialumia1520)
        await cartFixture.addToCartSuccessful([
            productDataFixture.samsungGalaxyS6, 
            productDataFixture.Nokialumia1520
        ])
    })
    //TODO: PASSED
    test("CT-004 | Add the same product twice", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture
    })=>{
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        
        await mainFixture.goToNav("Home (current)")

        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([
            productDataFixture.samsungGalaxyS6, 
            productDataFixture.samsungGalaxyS6
        ])
    })
    //TODO: PASSED
    test("CT-015 | Add many items (10) or max", async({
        cartFixture,
    })=>{
        // Adds all 9 products, so give it more than the default 30s
        const products = await cartFixture.addAllProductsToCart()
        expect(products.length).toBeGreaterThanOrEqual(9)

        await cartFixture.addToCartSuccessful(products)
        await cartFixture.cartTotalPrice()
    })
    //TODO: PASSED
    test("CT-017 | Rapid double-click 'Add to cart'", async({
        cartFixture, productDataFixture, mainFixture
    })=>{
        const s6 = productDataFixture.samsungGalaxyS6
        await cartFixture.addProductToCart(s6)
        await cartFixture.clickAddToCart()

        await cartFixture.addToCartSuccessful([s6, s6])
    })
    //TODO: PASSED
})
