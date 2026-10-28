import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    test("LG-001 | Login modal opens from navbar", async({authFixture})=>{
        await authFixture.navigateToLoginSection()
    })
    //TODO: PASSED

    test("LG-006 | Close modal without logging in", async({authFixture, userDataFixture, page})=>{
        const loginRequests: string[] = []
        page.on("request", request => {
            if (request.url().endsWith("/login")) loginRequests.push(request.url())
        })

        // Enter credentials, then close instead of logging in
        const account = userDataFixture.generateAccount()
        await authFixture.navigateToLoginSection()
        await authFixture.loginFillUsername(account.username)
        await authFixture.loginFillPassword(account.password)
        await authFixture.closeModal()

        expect(loginRequests, "closing the modal must not send a login request").toEqual([])
        await authFixture.greetingUserHidden()
    })
    //TODO: PASSED
    test("LG-007 | Password input is masked", async({authFixture, userDataFixture})=>{
        await authFixture.navigateToLoginSection()
        await authFixture.loginFillPassword(userDataFixture.generatePassword())
        await expect(authFixture.pages.auth.loginPasswordInput).toHaveAttribute("type", "password")
    })
    //TODO: PASSED
})
