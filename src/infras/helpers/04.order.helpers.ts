import { expect, Locator } from "@playwright/test"
import { BasePage } from "@infras/pages/01.base.page"
import IndexPage from "@infras/pages/00.index"
import IndexData from "@data/00.index"
import { orderFormField, PurchaseConfirmation } from "@type/04.order.type"

export class OrderHelpers extends BasePage {
    readonly pages = new IndexPage(this.page)

    async getOrderPrice(): Promise<string> {
        const totalPrice = await this.pages.order.orderTotal.innerText()
        return totalPrice
    }
    async fillField(inputField: orderFormField, content: string) {
        const { order } = this.pages
        let input: Locator
        switch (inputField) {
            case "name":
                input = order.orderNameInput
                break
            case "country":
                input = order.orderCountryInput
                break
            case "city":
                input = order.orderCityInput
                break
            case "credit card":
                input = order.orderCardInput
                break
            case "month":
                input = order.orderMonthInput
                break
            case "year":
                input = order.orderYearInput
                break
        }
        // On Firefox under a heavy parallel run, a value filled while the modal is still opening is sometimes lost.
        // Refill until the value sticks (same fix as fillAndKeep in auth.helpers); the value is still checked.
        await expect(async () => {
            await input.fill(content)
            await expect(input).toHaveValue(content, { timeout: 1_000 })
        }).toPass({ timeout: 10_000 })
    }
    async clickOnPurchase() {
        await this.pages.order.purchaseButton.click()
    }
    /* Read the lines of the confirmation popup */
    // All lines sit in one <p> split by <br>, so no line has its own locator; split the text instead
    async getPurchaseConfirmation(): Promise<PurchaseConfirmation> {
        await expect(this.pages.order.confirmTitle).toBeVisible()
        const text = await this.pages.order.confirmDetails.innerText()
        const lines = Object.fromEntries(
            text.split("\n").map((line) => {
                const [key, ...value] = line.split(": ")
                return [key.trim(), value.join(": ").trim()]
            }),
        )
        return {
            id: lines["Id"],
            // "360 USD" -> "360", the same form as the cart total
            amount: lines["Amount"].replace(" USD", ""),
            cardNumber: lines["Card Number"],
            name: lines["Name"],
            // The site counts months from 0, so October shows as "29/9/2026"
            date: lines["Date"],
        }
    }

    /* Close the confirmation popup with OK and wait for the site to go back to the home page */
    // OK runs the site's callback (go to index.html) only once the popup has the "visible" class (end of its opening animation).
    // Clicked earlier, OK just closes the popup, the page stays on cart.html and the Place order modal keeps blocking clicks.
    async clickOnConfirmPurchase() {
        await expect(this.pages.order.confirmPopup).toHaveClass(/\bvisible\b/)
        await this.pages.order.confirmOkButton.click()
        await expect(this.page).toHaveURL(/index\.html/)
        await expect(this.pages.order.confirmPopup).toBeHidden()
    }

    async clickOncloseOrderForm() {
        await this.pages.order.orderCloseButton.click()
        await expect(this.pages.order.confirmPopup).toBeHidden()
    }
}
export default OrderHelpers
