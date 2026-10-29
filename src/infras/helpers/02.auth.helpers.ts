import { expect, Locator } from "@playwright/test"
import { BasePage } from "@infras/pages/01.base.page"
import IndexPage from "@infras/pages/00.index"
import { Account } from "@type/01.account.type"

export class AuthHelpers extends BasePage {
    readonly pages = new IndexPage(this.page)

    /* Log in */
    async navigateToLoginSection() {
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

    async loginFillUsername(username: string) {
        await this.fillAndKeep(this.pages.auth.loginUsernameInput, username)
    }

    async loginFillPassword(password: string) {
        await this.fillAndKeep(this.pages.auth.loginPasswordInput, password)
    }

    // On Firefox under a heavy parallel run, a value filled while the modal is still opening is sometimes lost
    // (the site's own scripts never clear these inputs). Refill until the value sticks; the value is still checked.
    private async fillAndKeep(input: Locator, value: string) {
        await expect(async () => {
            await input.fill(value)
            await expect(input).toHaveValue(value, { timeout: 1_000 })
        }).toPass({ timeout: 10_000 })
    }

    async clickOnLoginButton() {
        await this.pages.auth.loginButton.click()
    }
    async greetingUserAppear(account: Account) {
        await expect(this.pages.main.taskBarWelcomeUser).toHaveText(`Welcome ${account.username}`)
    }
    async greetingUserHidden() {
        await expect(this.pages.main.taskBarWelcomeUser).toBeHidden()
    }
    async loginSuccess(account: Account) {
        await this.loginFillUsername(account.username)
        await this.loginFillPassword(account.password)
        await this.clickOnLoginButton()
        await this.greetingUserAppear(account)
        await expect(this.pages.auth.loginModal).toBeHidden()
        await expect(this.pages.main.taskBarLogout).toBeVisible()
        await expect(this.pages.main.taskBarLogin).toBeHidden()
        await expect(this.pages.main.taskBarSignup).toBeHidden()
    }
    // "anyError" accepts either server error: on the public site, odd usernames may already be registered by someone
    async loginFailure(
        account: Account,
        type: "userNotExist" | "wrongPassword" | "empty" | "anyError" = "userNotExist",
    ) {
        const expectedMessages = {
            userNotExist: ["User does not exist."],
            wrongPassword: ["Wrong password."],
            empty: ["Please fill out Username and Password."],
            anyError: ["User does not exist.", "Wrong password."],
        }[type]

        await this.loginFillUsername(account.username)
        await this.loginFillPassword(account.password)
        // Listen before clicking: the "empty" alert fires during the click, and an unhandled alert is auto-dismissed
        // No own timeout: the other alerts wait for the login API, which can take over 10s under parallel runs
        const dialogPromise = this.page.waitForEvent("dialog")
        // The click only finishes once the alert is closed, so accept it before awaiting the click
        const clickPromise = this.clickOnLoginButton()
        const dialog = await dialogPromise
        const dialogType = dialog.type()
        const dialogMessage = dialog.message()
        await dialog.accept()
        await clickPromise

        expect(dialogType).toBe("alert")
        expect(expectedMessages).toContain(dialogMessage)
    }
    async closeModal() {
        await this.pages.auth.loginCloseButton.click()
        await expect(this.pages.auth.loginModal).toBeHidden()
    }
    /* Sign in */
    async navigateToSignInSection() {
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
    async logoutSuccessful() {
        await this.pages.main.taskBarLogout.click()
        await this.greetingUserHidden()
        await expect(this.pages.main.taskBarLogout).toBeHidden()
        await expect(this.pages.main.taskBarLogin).toBeVisible()
        await expect(this.pages.main.taskBarSignup).toBeVisible()
    }
}

export default AuthHelpers
