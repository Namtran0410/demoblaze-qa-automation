import {test, expect} from "@fixture/00.index.fixture"

test.describe("Cart | Cart modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })

    test("CT-005 | Delete one item from cart", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture
    })=>{
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        
        await cartFixture.addToCartSuccessful([
            productDataFixture.samsungGalaxyS6
        ])

        await cartFixture.deleteSingleProduct(productDataFixture.samsungGalaxyS6)
    })
    //TODO: PASSED
    test("CT-006 | Delete all items from cart", async({
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
            productDataFixture.samsungGalaxyS6,

        ])

        await cartFixture.deleteAllItem()
    })
    //TODO: PASSED
})
