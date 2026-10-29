import { test, expect } from "@fixture/00.index"

test.describe("Login | Login modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })

    test.use({ accountCreation: "api" })
    test("LG-002 | Login with valid credentials", async ({ account, authFixture }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
    })
    //TODO: PASSED
    test("LG-008 | Login with Unicode / special-character username", async ({ accountCreator, authFixture }) => {
        const account = await accountCreator.create({
            username: `Nguyễn_用户_${Date.now()}`,
            password: "Test@123",
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
    })
    //TODO: PASSED
    // The account fixture registers a timestamped username; a short random one could already be taken on the public site
    test("LG-013 | UI | Login with wrong password", async ({ account, authFixture, userDataFixture }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure(
            {
                username: account.username,
                password: userDataFixture.generatePassword(),
            },
            "wrongPassword",
        )
    })
    //TODO: PASSED
    test("LG-014 | UI | Login with non-existent username", async ({ authFixture, userDataFixture }) => {
        // Never registered, so no account is needed
        const neverRegistered = userDataFixture.generateAccount()
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure(neverRegistered, "userNotExist")
    })
    //TODO: PASSED

    test("LG-015 | UI | Password is case-sensitive", async ({ account, authFixture }) => {
        const invertCase = (text: string) =>
            [...text].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("")
        const wrongCase = invertCase(account.password)
        // A password without letters would stay the same and log in, failing the test for the wrong reason
        expect(wrongCase, "the password must contain letters to flip").not.toBe(account.password)

        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure(
            {
                username: account.username,
                password: wrongCase,
            },
            "wrongPassword",
        )
    })
    //TODO: PASSED

    test("LG-019 | UI | Username with leading/trailing spaces", async ({ account, authFixture }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure(
            {
                username: " " + account.username + " ",
                password: account.password,
            },
            "userNotExist",
        )
    })
    //TODO: PASSED
    test("LG-020 | UI | Username in different letter case", async ({ account, authFixture }) => {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure(
            {
                username: account.username.toUpperCase(),
                password: account.password,
            },
            "userNotExist",
        )
    })
    //TODO: PASSED
    test("LG-022 | UI | Double-click 'Log in' button", async ({ account, authFixture, page }) => {
        const dialogs: string[] = []
        page.on("dialog", async (dialog) => {
            dialogs.push(dialog.message())
            await dialog.accept()
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginFillUsername(account.username)
        await authFixture.loginFillPassword(account.password)
        await authFixture.pages.auth.loginButton.dblclick()

        // Check after login has finished: an error alert would have arrived by then
        await authFixture.greetingUserAppear(account)
        expect(dialogs, "no error alert should be shown").toEqual([])
    })
    //TODO: PASSED
})
