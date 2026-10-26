import { expect } from "@playwright/test";
import { BasePage } from "@infras/00.pages/01.base.page";
import IndexPage from "@infras/00.pages/00.index.page";
import { Account } from "@business/01.account/00.account.creator";

export class AuthHelpers extends BasePage {
    readonly pages = new IndexPage(this.page)

    /* Log in */
    async navigateToLoginSection(){
        await this.pages.main.taskBarLogin.click()
        await expect(this.pages.auth.loginModal).toBeVisible()
        
        /* Action buttons are visible */
        await expect(this.pages.auth.loginButton).toBeVisible()
        await expect(this.pages.auth.loginCloseButton).toBeVisible()

        /* Input fields are visible */
        await expect(this.pages.auth.loginUsernameInput).toBeVisible()
        await expect(this.pages.auth.loginPasswordInput).toBeVisible()

        /* Title Fields are visible */
        await expect(this.pages.auth.loginUsernameLabel).toBeVisible()
        await expect(this.pages.auth.loginPasswordLabel).toBeVisible()
    }

    async fillUsername(username: string){
        await this.pages.auth.loginUsernameInput.clear()
        await this.pages.auth.loginUsernameInput.fill(username)
        await expect(this.pages.auth.loginUsernameInput).toHaveValue(username)
    }

    async fillPassword(password: string) {
        await this.pages.auth.loginPasswordInput.clear()
        await this.pages.auth.loginPasswordInput.fill(password)
        await expect(this.pages.auth.loginPasswordInput).toHaveValue(password)
    }

    async clickOnLoginButton(){
        await this.pages.auth.loginButton.click()
    }
    async greetingUserAppear(account: Account){
        await expect(this.pages.main.taskBarWelcomeUser).toHaveText(`Welcome ${account.username}`)
    }
    async loginSuccess(account: Account){
        await this.fillUsername(account.username)
        await this.fillPassword(account.password)
        await this.clickOnLoginButton()
        await this.greetingUserAppear(account)
        await expect(this.pages.auth.loginModal).toBeHidden()
        await expect(this.pages.main.taskBarLogout).toBeVisible()
        await expect(this.pages.main.taskBarLogin).toBeHidden()
        await expect(this.pages.main.taskBarSignup).toBeHidden()
    }
    /* Sign in */
    async navigateToSignInSection(){
        await this.pages.main.taskBarSignup.click()
        await expect(this.pages.auth.signUpModal).toBeVisible()
        
        /* Action buttons are visible */
        await expect(this.pages.auth.signUpButton).toBeVisible()
        await expect(this.pages.auth.signUpCloseButton).toBeVisible()

        /* Input fields are visible */
        await expect(this.pages.auth.signUpUsernameInput).toBeVisible()
        await expect(this.pages.auth.signUpPasswordInput).toBeVisible()

        /* Title Fields are visible */
        await expect(this.pages.auth.signUpUsernameLabel).toBeVisible()
        await expect(this.pages.auth.signUpPasswordLabel).toBeVisible()
    }

}

export default AuthHelpers