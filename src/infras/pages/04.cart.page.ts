import { Locator } from "@playwright/test"
import { BasePage } from "@infras/pages/01.base.page"

export class CartPage extends BasePage {
    // Product detail page (prod.html?idp_=<id>): the details sit in a div that has no role
    get productDetail() {
        return this.page.locator("#tbodyid")
    }
    get productName() {
        return this.productDetail.getByRole("heading", { level: 2 })
    }
    // Text is "$360 *includes tax"
    get productPrice() {
        return this.productDetail.getByRole("heading", { level: 3 })
    }
    get addToCartButton() {
        return this.page.getByRole("link", { name: "Add to cart" })
    }

    // Cart page (cart.html)
    get cartTitle() {
        return this.page.getByRole("heading", { name: "Products", level: 2 })
    }
    get cartTable() {
        return this.page.getByRole("table")
    }
    // Header cells: Pic, Title, Price, x
    get cartHeaders() {
        return this.cartTable.getByRole("columnheader")
    }
    // Rows load from the API after the page opens; #tbodyid holds only item rows, not the header row
    get cartRows() {
        return this.page.locator("#tbodyid").getByRole("row")
    }
    // Several rows can share a name when the same product is added twice
    cartRow(productName: string): Locator {
        return this.cartRows.filter({ has: this.page.getByRole("cell", { name: productName, exact: true }) })
    }
    // Cells of one row, in column order: Pic, Title, Price, x (Delete)
    cartRowCells(row: Locator): Locator {
        return row.getByRole("cell")
    }
    // Columns: a cell role does not know its column, so pick the nth td of every item row (XPath counts from 1)
    get cartPicColumn() {
        return this.cartRows.locator("xpath=./td[1]")
    }
    get cartTitleColumn() {
        return this.cartRows.locator("xpath=./td[2]")
    }
    // Bare numbers, e.g. "360"
    get cartPriceColumn() {
        return this.cartRows.locator("xpath=./td[3]")
    }
    get cartDeleteColumn() {
        return this.cartRows.locator("xpath=./td[4]")
    }
    // The product picture has no alt text, so it is found by role only
    cartRowImage(row: Locator): Locator {
        return row.getByRole("img")
    }
    cartRowDeleteButton(nth: number = 0): Locator {
        return this.cartRows.getByRole("link", { name: "Delete" }).nth(nth)
    }
    cartRowDelete(productName: string): Locator {
        return this.cartRow(productName).getByRole("link", { name: "Delete" })
    }
    // Total is a heading without a stable name (its text is the number), so use its id
    get cartTotal() {
        return this.page.locator("#totalp")
    }
    get placeOrderButton() {
        return this.page.getByRole("button", { name: "Place Order" })
    }
}

export default CartPage
