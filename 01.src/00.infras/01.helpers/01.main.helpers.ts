import { expect } from "@playwright/test";
import { BasePage } from "@infras/00.pages/01.base.page";
import IndexPage from "@infras/00.pages/00.index.page";

export class MainHelpers extends BasePage {
    readonly pages = new IndexPage(this.page)

    private get main() {
        return this.pages.main
    }

    /* Navigate to the main page */
    async goto() {
        await this.page.goto("/")
        await expect(this.page).toHaveURL(process.env.BASE_URL as string)
        await this.checkNavigationSuccessful()
    }

    async checkNavigationSuccessful() {
        const { taskBarLogo, taskBarHome, taskBarCart, taskBarLogin, taskBarSignup, productTitles } = this.main

        await expect(this.page).toHaveTitle("STORE")
        // Products load from the API after the page opens, so productTitles also checks that the API answered
        for (const element of [taskBarLogo, taskBarHome, taskBarCart, taskBarLogin, taskBarSignup, productTitles.first()]) {
            await expect(element).toBeVisible()
        }
    }

    /* Open the first product's detail page */
    async clickOnFirstProduct() {
        await this.main.productLinks.first().click()
        await expect(this.page).toHaveURL(/prod\.html\?idp_=/)
    }
    async goToNav(barName: "Home (current)" | "Contact"| "About us" | "Cart" | "Log out") {
        await (await this.main.getNavBar(barName)).click()
    }
    async getProductPrice(productName: string) {
        const price = this.pages.main.productPrice(productName)
        return price
    }
}

export default MainHelpers
