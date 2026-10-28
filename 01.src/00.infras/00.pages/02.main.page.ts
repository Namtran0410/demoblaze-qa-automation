import { Locator, expect } from "@playwright/test";
import {BasePage} from "@infras/00.pages/01.base.page";

export class MainPage extends BasePage {
    // Task bar
    async getNavBar(barName: "Home (current)" | "Contact"| "About us" | "Cart" | "Log out" ){
        return this.page.getByRole("link", { name: barName, exact: true })
    }
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
    // Each title wraps a link to prod.html?idp_=<id>
    get productLinks() {
        return this.productTitles.getByRole("link")
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

    // Categories: the category links are in the footer, so scope to the footer
    category(name: "Phones" | "Laptops" | "Monitors"): Locator {
        return this.page.getByRole("link", { name, exact: true })
    }

    product(name: string): Locator {
        return this.productList.getByRole("link", { name, exact: true })
    }
    // A card has no role, so pick the .card that holds the product's title link
    productCard(name: string): Locator {
        // "has" is searched inside each card, so it must not start from #tbodyid again
        return this.productList.locator(".card").filter({ has: this.page.getByRole("link", { name, exact: true }) })
    }
    // Text is "$360" (no "*includes tax" here, unlike the product page)
    productPrice(name: string): Locator {
        return this.productCard(name).getByRole("heading", { level: 5 })
    }
}
