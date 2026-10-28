import { test, expect } from "@fixture/index"

test.describe("Login | Login modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })
    test("LG-009 | Login request does not send plain-text password", async ({ page, authFixture, account }) => {
        await authFixture.navigateToLoginSection()

        // Start listening before clicking so the request is not missed
        const loginRequest = page.waitForRequest((req) => req.url().endsWith("/login") && req.method() === "POST")
        await authFixture.loginSuccess(account)

        const payload = (await loginRequest).postDataJSON()
        // console.log(account)
        // console.log(payload)
        expect(payload.password).not.toBe(account.password)
        expect(payload.password).toBe(Buffer.from(account.password).toString("base64"))
    })
    //TODO: PASSED
    test("LG-017 | SQL injection string in username", async ({ page, context, authFixture }) => {
        const loginStatuses: number[] = []
        page.on("response", (response) => {
            if (response.url().endsWith("/login")) loginStatuses.push(response.status())
        })

        await authFixture.navigateToLoginSection()
        // Someone has registered this username on the public site, so the alert can be either server error
        await authFixture.loginFailure(
            {
                username: `' OR '1'='1`,
                password: `' OR '1'='1`,
            },
            "anyError",
        )

        // No server error
        expect(
            loginStatuses.every((status) => status < 500),
            `login responses: ${loginStatuses}`,
        ).toBeTruthy()
        // No session created
        const cookies = await context.cookies()
        expect(cookies.find((cookie) => cookie.name === "tokenp_")).toBeUndefined()
        await authFixture.greetingUserHidden()
    })
    //TODO: PASSED
    test("LG-018 | XSS payload in username", async ({ page, authFixture }) => {
        const dialogs: string[] = []
        page.on("dialog", async (dialog) => {
            dialogs.push(dialog.message())
            await dialog.accept()
        })

        await authFixture.navigateToLoginSection()
        await authFixture.loginFillUsername(`<img src=x onerror=alert('xss')>`)
        await authFixture.loginFillPassword("anything")
        await authFixture.clickOnLoginButton()

        // Login fails with an error alert (someone may have registered this username, so either error is fine)
        await expect
            .poll(() => dialogs)
            .toEqual(expect.arrayContaining([expect.stringMatching(/^(User does not exist\.|Wrong password\.)$/)]))
        // The payload was not executed
        expect(dialogs).not.toContain("xss")
        await expect(page.locator('img[src="x"]')).toHaveCount(0)
        await authFixture.greetingUserHidden()
    })
    //TODO: PASSED
})
