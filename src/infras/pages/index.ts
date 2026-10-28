import { Page } from "@playwright/test"
import { MainPage } from "@infras/pages/main.page"
import { AuthPage } from "@infras/pages/auth.page"
import { CartPage } from "@infras/pages/cart.page"
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
