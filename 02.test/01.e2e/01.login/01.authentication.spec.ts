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
    test("LG-014 | UI | Login with non-existent username", async({
        accountCreator, authFixture, userData
    })=> {
        const account = await accountCreator.create({
            username: userData.generateUserName(),
            password: userData.generatePassword()  
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginFailure({
            username: userData.generateUserName(),
            password: account.password
        }, "userNotExist")
    })
    //TODO: PASSED

    test("LG-015 | UI | Password is case-sensitive", async({
        accountCreator, authFixture, userData
    })=> {
    const invertCase = (text: string) =>
        [...text].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("")  
    const account = {
        username: userData.generateUserName(),
        password: userData.generatePassword()
    }
    await accountCreator.create(account)
    await authFixture.navigateToLoginSection()
    await authFixture.loginFailure({
        username: account.username,
        password: invertCase(account.password)
    }, "wrongPassword")
    })
    //TODO: PASSED
    
    test("LG-019 | UI | Username with leading/trailing spaces", async({
        accountCreator, authFixture, userData
    })=> {
    const account = {
        username: userData.generateUserName(),
        password: userData.generatePassword()
    }
    await accountCreator.create(account)
    await authFixture.navigateToLoginSection()
    await authFixture.loginFailure({
        username: " "+ account.username + " ",
        password: account.password
    }, "userNotExist")
    })
    //TODO: PASSED
    test("LG-020 | UI | Username in different letter case", async({
        accountCreator, authFixture, userData
    })=> {
    const account = {
        username: userData.generateUserName(),
        password: userData.generatePassword()
    }
    await accountCreator.create(account)
    await authFixture.navigateToLoginSection()
    await authFixture.loginFailure({
        username: account.username.toUpperCase(),
        password: account.password
    }, "userNotExist")
    })
    //TODO: PASSED
    test("LG-022 | UI | Double-click 'Log in' button", async({
        account, authFixture, userData, page
    })=> {
        const dialogs: string[] = []
        page.on("dialog", async dialog => {
            dialogs.push(dialog.message())
            await dialog.accept()
        })
        await authFixture.navigateToLoginSection()
        await authFixture.loginFillUsername(account.username)
        await authFixture.loginFillPassword(account.password)
        await authFixture.clickOnLoginButton()
        await authFixture.clickOnLoginButton()
        expect(dialogs).toEqual([])
    })
    //TODO: PASSED
})
