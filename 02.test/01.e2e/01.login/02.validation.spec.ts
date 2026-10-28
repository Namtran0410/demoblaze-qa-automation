import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    
    test("LG-010 | Login with incorrect username and incorrect password", async({
        authFixture, 
        userDataFixture
    })=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: userDataFixture.generateUserName(),
            password: userDataFixture.generatePassword()
        })
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
})
