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
})
