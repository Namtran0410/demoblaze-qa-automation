import { Locator, expect } from "@playwright/test";
import BasePage from "@infras/00.pages/01.base.page";

export class MainPage extends BasePage {
    // Task bar
    get taskBarLogo() {
        return this.page.getByRole("link", { name: "PRODUCT STORE" })
    }
    get taskBarHome() {
        return this.page.getByRole("link", { name: "Home (current)" })
    }
    get taskBarContact() {
        return this.page.getByRole("link", { name: "Contact", exact: true })
    }
    get taskBarAboutUs() {
        return this.page.getByRole("link", { name: "About us", exact: true })
    }
    get taskBarCart() {
        return this.page.getByRole("link", { name: "Cart", exact: true })
    }
    get taskBarLogin() {
        return this.page.getByRole("link", { name: "Log in", exact: true })
    }
    get taskBarSignup() {
        return this.page.getByRole("link", { name: "Sign up", exact: true })
    }
    get taskBarLogout() {
        return this.page.getByRole("link", { name: "Log out", exact: true })
    }
    get taskBarWelcomeUser() {
        return this.page.getByRole("link", { name: /^Welcome / })
    }

    // Products: cards have no role, so role queries are scoped to the product list (footer also has h4 headings)
    get productList() {
        return this.page.locator("#tbodyid")
    }
    get productTitles() {
        return this.productList.getByRole("heading", { level: 4 })
    }
    // The carousel also has Previous/Next buttons, so scope to the list that holds the paging buttons
    get pagination() {
        return this.page.getByRole("list").filter({ has: this.page.getByRole("button", { name: "Next" }) })
    }
    get paginationNext() {
        return this.pagination.getByRole("button", { name: "Next" })
    }
    get paginationPrevious() {
        return this.pagination.getByRole("button", { name: "Previous" })
    }

    category(name: "Phones" | "Laptops" | "Monitors"): Locator {
        return this.page.getByRole("link", { name, exact: true })
    }

    product(name: string): Locator {
        return this.productList.getByRole("link", { name, exact: true })
    }

    // Products load from the API after the page opens, so wait for the first one
    async goto() {
        await this.page.goto("/")
        await expect(this.page).toHaveTitle("STORE")
        await expect(this.taskBarLogo).toBeVisible()
        await expect(this.productTitles.first()).toBeVisible()
    }
}
