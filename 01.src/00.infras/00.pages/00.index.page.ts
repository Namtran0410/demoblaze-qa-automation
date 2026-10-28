import { Page } from "@playwright/test";
import { MainPage } from "@infras/00.pages/02.main.page";
import { AuthPage } from "@infras/00.pages/03.login.page";
import { CartPage } from "@infras/00.pages/04.cart.page";
export class IndexPage {
    readonly main: MainPage
    readonly auth: AuthPage
    readonly cart: CartPage
    constructor(page: Page) {
        this.main = new MainPage(page)
        this.auth = new AuthPage(page)
        this.cart = new CartPage(page)
    }
}

export default IndexPage
