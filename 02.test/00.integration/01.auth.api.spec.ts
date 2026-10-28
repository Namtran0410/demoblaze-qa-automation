import { LoginError } from "@infras/02.api/01.api.auth"
import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{

    test("LG-013 | API | Login with wrong password", async({
        authApi, account
    })=> {
        await authApi.loginFailure({
            username: account.username,
            password: account.password + "aaa"
        }, LoginError.wrongPassword)
    })
    //TODO: PASSED
    test("LG-014 | API | Login with non-existent username", async({
        authApi, account, userDataFixture
    })=> {
        await authApi.loginFailure({
            // A short random name can match an existing user on the public site; the timestamped one cannot
            username: userDataFixture.generateAccount().username,
            password: account.password
        }, LoginError.userNotExist)
    })
    //TODO: PASSED
    test("LG-025 | API | POST /login with valid credentials returns token", async({
        authApi, account
    })=> {
        await authApi.loginSuccess(account)
    })
    //TODO: PASSED
})
