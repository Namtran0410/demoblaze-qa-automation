import {test, expect} from "@fixture/00.index.fixture"

test.describe("Login | Login modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })
    
    test.use({ accountCreation: "api" })
    test("LG-002 | Login with valid credentials", async({account, authFixture})=> {
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
    })
    //TODO: PASSED
    test("LG-008 | Login with Unicode / special-character username", async({accountCreator, authFixture})=> {
        const account = await accountCreator.create({
            username: `Nguyễn_用户_${Date.now()}`,
            password: "Test@123"  
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginSuccess(account)
    })
    //TODO: PASSED
    test("LG-013 | UI | Login with wrong password", async({
        accountCreator, authFixture, userDataFixture
    })=> {
        const account = await accountCreator.create({
            username: userDataFixture.generateUserName(),
            password: userDataFixture.generatePassword()  
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: account.username,
            password: userDataFixture.generatePassword()
        }, "wrongPassword")
    })
    //TODO: PASSED
})
