import { LoginError } from "@business/02.auth/00.api.auth"
import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{

    test("LG-013 | API | Login with wrong password", async({
        authApi, account
    })=> {
        await authApi.login({
            username: account.username,
            password: account.password + "aaa"
        }, LoginError.wrongPassword)
    })
    //TODO: PASSED
})
