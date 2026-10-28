import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    
    test("LG-010 | Login with empty username and password", async({
        authFixture,
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: "",
            password: ""
        }, "empty")
    })
    //TODO: PASSED
    test("LG-011 | Login with empty username", async({
        authFixture,
        userDataFixture
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: "",
            password: userDataFixture.generatePassword()
        }, "empty")
    })
    //TODO: PASSED
    test("LG-012 | Login with empty password", async({
        authFixture,
        userDataFixture
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: userDataFixture.generateUserName(),
            password: ""
        }, "empty")
    })
    //TODO: PASSED
    test("LG-016 | Whitespace-only username and password", async({
        authFixture,
    })=> {
        test.fail(true, "Known defect: input is not trimmed, so whitespace is sent to the API and returns 'Wrong password.'")
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: "        ",
            password: "        "
        }, "empty")
    })
    //TODO: KNOWN DEFECT (test.fail)
    test("LG-021 | Very long username (2000 characters)", async({
        page, authFixture, userDataFixture
    })=> {
        test.fail(true, "Known defect: a 2000-character username makes POST /login return 500, and the page shows no message")
        const loginStatuses: number[] = []
        page.on("response", response => {
            if (response.url().endsWith("/login")) loginStatuses.push(response.status())
        })
        // Only a login attempt is needed; the case does not register the long username
        await authFixture.navigateToLoginSection()
        await authFixture.loginFillUsername("a".repeat(2000))
        await authFixture.loginFillPassword(userDataFixture.generatePassword())
        await authFixture.clickOnLoginButton()

        await expect.poll(() => loginStatuses).not.toHaveLength(0)
        expect(loginStatuses.filter(status => status >= 500), "BUG: server error on a long username").toEqual([])
    })
    //TODO: KNOWN DEFECT (test.fail)
})
