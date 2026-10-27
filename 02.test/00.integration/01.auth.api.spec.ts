import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{

    test("LG-013 | API | Login with wrong password", async({
        accountCreator, authFixture, userData
    })=> {
        const account = await accountCreator.create({
            username: userData.generateUserName(),
            password: userData.generatePassword()  
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: account.username,
            password: userData.generatePassword()
        }, "wrongPassword")
    })
    //TODO: PASSED
})
