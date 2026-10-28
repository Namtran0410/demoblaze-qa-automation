import {test, expect} from "@fixture/00.index.fixture"
import MainHelpers from "@infras/01.helpers/01.main.helpers"
import AuthHelpers from "@infras/01.helpers/02.login.helpers"
import CartHelpers from "@infras/01.helpers/03.cart.helpers"

test.describe("Cart | Cart modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })

    test("CT-007 | Guest cart persists after reload", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        mainFixture
    })=>{
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([
            productDataFixture.samsungGalaxyS6
        ])
        await mainFixture.goToNav("Home (current)")
        await mainFixture.reload()

        await mainFixture.goToNav("Cart")
        await mainFixture.reload()

        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED
    test("CT-008 | Logged-in cart persists across sessions", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        page,
        browser
    })=>{
        /** Login success*/
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)

        /** Add samsung galaxy S6 to cart*/
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])

        /** Logout and close browser */
        await authFixture.logoutSuccessful()
        await page.close()

        /** Open a new browser session: the fixtures above stay bound to the closed page, so build new helpers */
        // A context made by hand does not get the config's baseURL, so pass it
        const context = await browser.newContext({ baseURL: process.env.BASE_URL })
        const newPage = await context.newPage()
        const newMain = new MainHelpers(newPage)
        const newAuth = new AuthHelpers(newPage)
        const newCart = new CartHelpers(newPage)

        /** Login again and check cart */
        await newMain.goto()
        await newAuth.navigateToLoginSection()
        await newAuth.loginSuccess(account)

        /** Check cart */
        await newCart.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await context.close()
    })
    //TODO: PASSED
    test("CT-013 | Users cannot see each other's carts", async({
        cartFixture,
        productDataFixture,
        authFixture,
        account,
        page,
        browser
    })=>{
        /** Add samsung galaxy S6 to cart*/
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])

        /** Logout and close browser */
        await page.close()

        /** Open a new browser session: the fixtures above stay bound to the closed page, so build new helpers */
        // A context made by hand does not get the config's baseURL, so pass it
        const context = await browser.newContext({ baseURL: process.env.BASE_URL })
        const newPage = await context.newPage()
        const newMain = new MainHelpers(newPage)
        const newAuth = new AuthHelpers(newPage)
        const newCart = new CartHelpers(newPage)

        /** Login again and check cart */
        await newMain.goto()

        /** Check cart */
        await newCart.cartEmpty()
        await context.close()
    })
    //TODO: PASSED
})
