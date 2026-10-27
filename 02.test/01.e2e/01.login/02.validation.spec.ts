import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    
    test("LG-010 | Login with incorrect username and incorrect password", async({
        authFixture, 
        userData
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: userData.generateUserName(),
            password: userData.generatePassword()
        })
    })
    //TODO: PASSED
    test("LG-011 | Login with empty username", async({
        authFixture,
        userData
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: "",
            password: userData.generatePassword()
        }, "empty")
    })
    //TODO: PASSED
    test("LG-012 | Login with empty password", async({
        authFixture,
        userData
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: userData.generateUserName(),
            password: ""
        }, "empty")
    })
    //TODO: PASSED
})
