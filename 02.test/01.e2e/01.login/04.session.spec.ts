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
})
