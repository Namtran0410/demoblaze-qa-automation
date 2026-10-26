import { Page } from "@playwright/test";
import { MainPage } from "@infras/00.pages/02.main.page";
import { AuthPage } from "@infras/00.pages/03.login.page";

export class IndexPage {
    readonly main: MainPage
    readonly auth: AuthPage

    constructor(page: Page) {
        this.main = new MainPage(page)
        this.auth = new AuthPage(page)
    }
}

export default IndexPage
