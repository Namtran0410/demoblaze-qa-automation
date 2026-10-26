import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    test("LG-001 | Login modal opens from navbar", async({authFixture})=>{
        await authFixture.navigateToLoginSection()
    })
    //TODO: PASSED
    
    test.use({ accountCreation: "api" })
    test("LG-002 | Login with valid credentials", async({account, authFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
    })
    //TODO: PASSED

    test("LG-003 | Session persists after page reload", async({account, authFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
        await authFixture.reload()
        await authFixture.greetingUserAppear(account)
    })
    //TODO: PASSED

})
