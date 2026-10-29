import { Page } from "@playwright/test"
import { MainPage } from "@infras/pages/02.main.page"
import { AuthPage } from "@infras/pages/03.auth.page"
import { CartPage } from "@infras/pages/04.cart.page"
import { OrderPage } from "@infras/pages/05.order.page"
export class IndexPage {
    readonly main: MainPage
    readonly auth: AuthPage
    readonly cart: CartPage
    readonly order: OrderPage
    constructor(page: Page) {
        this.main = new MainPage(page)
        this.auth = new AuthPage(page)
        this.cart = new CartPage(page)
        this.order = new OrderPage(page)
    }
}

export default IndexPage
