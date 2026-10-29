import { BasePage } from "@infras/pages/01.base.page"

export class OrderPage extends BasePage {
    // Place order modal (opened by "Place Order" on cart.html)
    get orderModal() {
        return this.page.getByRole("dialog", { name: "Place order" })
    }
    get orderTitle() {
        return this.orderModal.getByRole("heading", { name: "Place order" })
    }
    // Total is a label without a stable name (its text is "Total: 790"), so use its id
    get orderTotal() {
        return this.page.locator("#totalm")
    }
    // The Total label also points to #name, so this input's name is "Total: 790 Name:" and must not be matched exactly
    get orderNameInput() {
        return this.orderModal.getByRole("textbox", { name: "Name:" })
    }
    get orderCountryInput() {
        return this.orderModal.getByRole("textbox", { name: "Country:" })
    }
    get orderCityInput() {
        return this.orderModal.getByRole("textbox", { name: "City:" })
    }
    get orderCardInput() {
        return this.orderModal.getByRole("textbox", { name: "Credit card:" })
    }
    get orderMonthInput() {
        return this.orderModal.getByRole("textbox", { name: "Month:" })
    }
    get orderYearInput() {
        return this.orderModal.getByRole("textbox", { name: "Year:" })
    }
    // Both the header X and the footer button are named "Close"
    get orderCloseX() {
        return this.orderModal.getByRole("button", { name: "Close" }).first()
    }
    get orderCloseButton() {
        return this.orderModal.getByRole("button", { name: "Close" }).last()
    }
    get purchaseButton() {
        return this.orderModal.getByRole("button", { name: "Purchase" })
    }

    // Purchase confirmation (SweetAlert popup): the popup div has no role, so use its class as the scope
    get confirmPopup() {
        return this.page.locator(".sweet-alert")
    }
    get confirmTitle() {
        return this.confirmPopup.getByRole("heading", { name: "Thank you for your purchase!" })
    }
    // Lines split by <br>, so innerText is "Id: 7560167\nAmount: 360 USD\nCard Number: 1234\nName: Test User\nDate: 29/9/2026"
    get confirmDetails() {
        return this.confirmPopup.getByRole("paragraph").first()
    }
    get confirmOkButton() {
        return this.confirmPopup.getByRole("button", { name: "OK" })
    }
}

export default OrderPage
