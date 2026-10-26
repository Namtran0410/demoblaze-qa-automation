import IndexPage from "@infras/00.pages/00.index.page";
import { Account, AccountCreator } from "./00.account.creator";
import { expect } from "@playwright/test";

export class UIAccountCreator implements AccountCreator {
    constructor(private readonly pages: IndexPage){}
    async create(account: Account){
        const { main, auth } = this.pages
        await main.taskBarSignup.click()
        await auth.signUpUsernameInput.fill(account.username)
        await auth.signUpPasswordInput.fill(account.password)
        const message = await auth.acceptDialog(() => auth.signUpButton.click())
        expect(message).toBe("Sign up successful.")
        await expect(auth.signUpModal).toBeHidden()

        return account
    }
}
