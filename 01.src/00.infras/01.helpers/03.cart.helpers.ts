import { expect } from "@playwright/test";
import { BasePage } from "@infras/00.pages/01.base.page";
import IndexPage from "@infras/00.pages/00.index.page";
import IndexData from "@data/00.index.data";
import { productInforType } from "@data/03.product.infor";

export class CartHelpers extends BasePage {
    readonly pages = new IndexPage(this.page)

    /* Add the product from its detail page and return the price shown there, as a number */
    async addProductToCart(productInfor: productInforType): Promise<string> {
        await this.pages.main.product(productInfor.name).click()
        await this.navigateToAddingProductPage(productInfor)
        // The product page shows "$360 *includes tax"; keep only the digits
        const price = Number((await this.pages.cart.productPrice.innerText()).replace(/\D/g, ""))
        await this.pages.main.acceptDialog(
            ()=> this.pages.cart.addToCartButton.click(),
            IndexData.dialogMessage.addToCartSuccess
        )
        return String(price)
    }
    async navigateToAddingProductPage(productInfor: productInforType) {
        expect(await this.pages.cart.productName.innerText()).toEqual(productInfor.name)
        expect(await this.pages.cart.productPrice.innerText()).toEqual(productInfor.price)
        expect(this.pages.cart.productDetail).toBeVisible()

    }
    /* Open the Cart and check each added product has a row with its name and price */
    async addToCartSuccessful(products: productInforType[]){
        await (await this.pages.main.getNavBar("Cart")).click()
        await expect(this.page).toHaveURL(/cart\.html/)
        await expect(this.pages.cart.cartTitle).toBeVisible()

        for (const product of new Set(products)) {
            const addedRows = products.filter(p => p === product).length
            // The cart shows the price as a bare number ("360"), the product page as "$360 *includes tax"
            const cartPrice = product.price.replace(/\D/g, "")
            const rows = this.pages.cart.cartRow(product.name)
            // Rows load from the API, and a guest cart can already hold the same product, so wait for at least the rows added here
            await expect.poll(() => rows.count()).toBeGreaterThanOrEqual(addedRows)
            for (let item = 0; item < addedRows; item++) {
                await expect(this.pages.cart.cartRowCells(rows.nth(item))).toHaveText(["", product.name, cartPrice, "Delete"])
            }
        }
    }
    async cartTotalPrice(): Promise<string> {
        const priceListStr= await this.pages.cart.cartPriceColumn.allInnerTexts()
        const priceList = priceListStr.map(item => Number(item))
        const totalPrice = priceList.reduce((acc: number, curr: number): number => {
            return acc + curr;
        }, 0)
        expect(await this.pages.cart.cartTotal.innerText()).toEqual(String(totalPrice))
        return String(totalPrice)
    }
    /* Open the Cart and check it has no rows and no total */
    async cartEmpty() {
        // An empty table is also what shows before the rows load, so wait for the viewcart answer before counting.
        // Listen before the click, or the response can come back before waitForResponse starts.
        const viewCart = this.page.waitForResponse(response => response.url().includes("/viewcart"))
        await (await this.pages.main.getNavBar("Cart")).click()
        await expect(this.page).toHaveURL(/cart\.html/)
        await viewCart

        await expect(this.pages.cart.cartRows).toHaveCount(0)
        // #totalp has no text when the cart is empty
        await expect(this.pages.cart.cartTotal).toBeEmpty()
    }
    async singlePriceInTable(): Promise<string> {
        const priceListStr= await this.pages.cart.cartPriceColumn.allInnerTexts() 
        return priceListStr[0]
    }
    /* On the Cart page, delete one row sof the product and check exactly one row is gone */
    async deleteSingleProduct(product: productInforType) {
        await expect(this.page).toHaveURL(/cart\.html/)
        const rows = this.pages.cart.cartRow(product.name)
        // Rows load from the API, so wait for one before counting
        await expect(rows.first()).toBeVisible()
        const rowsBefore = await rows.count()

        await this.pages.cart.cartRowDelete(product.name).first().click()
        // Delete calls the API and then redraws the whole table
        await expect(rows).toHaveCount(rowsBefore - 1)
    }

    /* On the Cart page, delete every row one by one and check the cart ends empty */
    async deleteAllItem() {
        await expect(this.page).toHaveURL(/cart\.html/)
        const rows = this.pages.cart.cartRows
        // Rows load from the API; counting too early reads 0 and the test would pass without deleting anything
        await expect(rows.first()).toBeVisible()
        const productCount = await rows.count()

        for (let deleted = 1; deleted <= productCount; deleted++) {
            // The table is redrawn after each delete and the rows shift up, so always delete the first row
            await this.pages.cart.cartRowDeleteButton(0).click()
            // Wait for the redraw before the next click, or it can hit a row that is already being deleted
            await expect(rows).toHaveCount(productCount - deleted)
        }
    }
    /* On the Cart page, check the headers, that every row has picture, title, price and Delete, and the Place Order button */
    async tableStructureVisible(){
        const cart = this.pages.cart
        await expect(this.page).toHaveURL(/cart\.html/)
        await expect(cart.cartHeaders).toHaveText(["Pic", "Title", "Price", "x"])

        // Rows load from the API; with no row the loop below would check nothing, so require one first
        await expect(cart.cartRows.first()).toBeVisible()
        const rowCount = await cart.cartRows.count()
        for (let item = 0; item < rowCount; item++) {
            const row = cart.cartRows.nth(item)
            const cells = cart.cartRowCells(row)
            await expect(cells).toHaveCount(4)
            await expect(cart.cartRowImage(row)).toBeVisible()
            await expect(cells.nth(1)).not.toBeEmpty()
            // The cart shows the price as a bare number, e.g. "360"
            await expect(cells.nth(2)).toHaveText(/^\d+$/)
            await expect(cart.cartRowDeleteButton(item)).toBeVisible()
        }

        await expect(cart.placeOrderButton).toBeVisible()
    }
}

export default CartHelpers