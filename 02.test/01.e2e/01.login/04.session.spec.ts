import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })

    test("LG-003 | Session persists after page reload", async({account, authFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await authFixture.reload()
        await authFixture.greetingUserAppear(account)
    })
    //TODO: PASSED
    test("LG-004 | Session persists across pages", async({account, authFixture, mainFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)

        /** Login state is still appear when user click on single product*/
        await mainFixture.clickOnFirstProduct()
        await authFixture.greetingUserAppear(account)

        /**Login state is still appear when user click on Home*/
        await mainFixture.goToNav("Home (current)")
        await authFixture.greetingUserAppear(account)
    })
    //TODO: PASSED
    test("LG-005 | Logout ends the session", async({account, authFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await authFixture.logoutSuccessful()
    })
    //TODO: PASSED
    test("LG-023 | Logout in one tab invalidates other tab after reload", async({
        account, 
        authFixture,
        mainFixture
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await authFixture.logoutSuccessful()
        await mainFixture.goToNav("Cart")
        await authFixture.greetingUserHidden()
    })
    //TODO: PASSED
    test("LG-024 | Auth token cookie lifecycle", async ({ context, account, authFixture }) => {
        const authCookie = async () => (await context.cookies()).find(cookie => cookie.name === "tokenp_")

        // Before login: no token
        expect(await authCookie()).toBeUndefined()

        // After login: the token cookie exists and is not empty
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        const token = await authCookie()
        expect(token, "tokenp_ cookie should exist after login").toBeDefined()
        expect(token!.value).not.toBe("")

        // After logout: the token cookie is removed
        await authFixture.logoutSuccessful()
        await expect.poll(authCookie, { message: "tokenp_ cookie should be removed after logout" }).toBeUndefined()
    })

})
