import { LoginError } from "@infras/api/01.auth.api"
import { test, expect } from "@fixture/00.index"

test.describe("Login | Login modal", () => {
    test("LG-013 | API | Login with wrong password", async ({ authApi, apiAccount }) => {
        await authApi.loginFailure(
            {
                username: apiAccount.username,
                password: apiAccount.password + "aaa",
            },
            LoginError.wrongPassword,
        )
    })
    //TODO: PASSED
    test("LG-014 | API | Login with non-existent username", async ({ authApi, apiAccount, userDataFixture }) => {
        await authApi.loginFailure(
            {
                // A short random name can match an existing user on the public site; the timestamped one cannot
                username: userDataFixture.generateAccount().username,
                password: apiAccount.password,
            },
            LoginError.userNotExist,
        )
    })
    //TODO: PASSED
    test("LG-025 | API | POST /login with valid credentials returns token", async ({ authApi, apiAccount }) => {
        await authApi.loginSuccess(apiAccount)
    })
    //TODO: PASSED
})
