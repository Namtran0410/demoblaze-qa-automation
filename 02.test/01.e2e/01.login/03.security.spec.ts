import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    test("LG-009 | Login request does not send plain-text password", async({page, authFixture, account})=>{
        await authFixture.navigateToLoginSection()

        // Start listening before clicking so the request is not missed
        const loginRequest = page.waitForRequest(req => req.url().endsWith("/login") && req.method() === "POST")
        await authFixture.loginSuccess(account)

        const payload = (await loginRequest).postDataJSON()
        // console.log(account)
        // console.log(payload)
        expect(payload.password).not.toBe(account.password)
        expect(payload.password).toBe(Buffer.from(account.password).toString("base64"))
    })
    //TODO: PASSED
})
