import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    test("LG-001 | Login modal opens from navbar", async({authFixture})=>{
        await authFixture.navigateToLoginSection()
    })
    //TODO: PASSED

    test("LG-006 | Close modal without logging in", async({authFixture})=>{
        await authFixture.navigateToLoginSection()
        await authFixture.clickOnLoginButton()
        await authFixture.closeModal()
    })
    //TODO: PASSED
    test("LG-007 | Password input is masked", async({authFixture, account})=>{
        await authFixture.navigateToLoginSection()
        await authFixture.clickOnLoginButton()
        await authFixture.loginFillPassword(account.password)
        await expect(authFixture.pages.auth.loginPasswordInput).toHaveAttribute("type", "password")
    })
    //TODO: PASSED
})
