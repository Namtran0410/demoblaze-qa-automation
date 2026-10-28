import { LoginError } from "@business/02.auth/00.api.auth"
import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{

    test("CT-012 | API | Guest cart is not shared between sessions", async({
        authApi, account
    })=> {
        await authApi.loginFailure({
            username: account.username,
            password: account.password + "aaa"
        }, LoginError.wrongPassword)
    })
    //TODO: PASSED
})
