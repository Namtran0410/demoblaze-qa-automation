import { test, expect } from "@fixture/00.index"
import IndexData from "@data/00.index"
import { faker } from "@faker-js/faker"

test.describe("Order | Order modal", () => {
    test.beforeEach("Navigation to main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })
    test("CT-001 | Guest adds a product to cart", async ({ cartFixture, productDataFixture }) => {
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
    })
    //TODO: PASSED

    test("OD-001 | 'Place Order' opens order form with total", async ({
        cartFixture,
        productDataFixture,
    }) => {
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
    })
    //TODO: PASSED
    test("OD-002 | Purchase with valid data", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // Filling the order form
        await orderBusiness.fillOrderForm()
        await orderFixture.clickOnPurchase()

        // Check order purchase successful
        await orderFixture.getPurchaseConfirmation()
    })
    //TODO: PASSED
    test.fail("OD-003 | Confirmation details match the order", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        const totalPrice = await cartFixture.clickOnPlaceOrder()
        
        // Filling the order form
        const orderFilled = await orderBusiness.fillOrderForm()
        await orderFixture.clickOnPurchase()

        // Check order purchase successful
        const purchaseSuccessInfor = await orderFixture.getPurchaseConfirmation()
        
        // Only Name and Credit card appear on the popup; its date has no form field to compare with
        expect(purchaseSuccessInfor.name, "Name").toEqual(orderFilled.name)
        expect(purchaseSuccessInfor.cardNumber, "Card Number").toEqual(orderFilled["credit card"])
        expect(purchaseSuccessInfor.amount, "Amount").toEqual(totalPrice)

        // The popup shows the date as "D/M/YYYY" without leading zeros, e.g. "29/10/2026"
        const today = new Date()
        const expectedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
        expect(purchaseSuccessInfor.date, "Date").toEqual(expectedDate)
    })
    //TODO: FAILED

    test("OD-004 | Cart is emptied after purchase", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
        mainFixture
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // Filling the order form
        await orderBusiness.fillOrderForm()
        await orderFixture.clickOnPurchase()

        // Check order purchase successful
        await orderFixture.getPurchaseConfirmation()
        
        // confirm and navigate to cart
        await orderFixture.clickOnConfirmPurchase()
        await mainFixture.goToNav("Cart")

        // Check cart is empty now
        await cartFixture.cartEmpty()
    })
    //TODO: PASSED
    test("OD-005 | Purchase with all fields empty", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldOrderConfirm,
        )
    })
    //TODO: PASSED
    test("OD-006 | Purchase with no credit cart ", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // fill all but credit cart is empty
        await orderBusiness.fillOrderForm()
        await orderFixture.fillField("credit card", "")

        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldCreditCard,
        )
    })
    //TODO: PASSED
    test("OD-007 | Purchase without name", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // fill all but credit cart is empty
        await orderBusiness.fillOrderForm()
        await orderFixture.fillField("name", "")

        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldCreditCard,
        )
    })
    //TODO: PASSED
    test("OD-008 | Close order form without purchasing", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        await orderFixture.clickOncloseOrderForm()
    })
    //TODO: PASSED
    test.fail("OD-009 | Non-numeric credit card number", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // fill all but credit cart is empty
        await orderBusiness.fillOrderForm()
        await orderFixture.fillField("credit card", faker.string.alpha(5))

        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldCreditCard,
        )
    })
    //TODO: FAILED
    test.fail("OD-010 | Invalid month / past year", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()
        
        // fill all but credit cart is empty
        await orderBusiness.fillOrderForm()
        await orderFixture.fillField("month", "13")
        await orderFixture.fillField("year", String(new Date().getFullYear() - 1))

        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldCreditCard,
        )
    })
    //TODO: FAILED
    test.fail("OD-011 | Place order with empty cart", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
        mainFixture
    }) => {
        // navigat to cart
        await mainFixture.goToNav("Cart")
        await cartFixture.clickOnPlaceOrder()

        // fill all but credit cart is empty
        await orderBusiness.fillOrderForm()
        await orderFixture.fillField("month", "13")
        await orderFixture.fillField("year", String(new Date().getFullYear() - 1))

        // Purchase with an empty form: the site shows a browser alert instead of the confirmation popup.
        // acceptDialog listens before the click, or Playwright would dismiss the alert before the test sees it.
        await orderFixture.acceptDialog(
            async () => await orderFixture.clickOnPurchase(),
            IndexData.dialogMessage.emptyFieldCreditCard,
        )
    })
    //TODO: FAILED
    test("OD-012 | Special / Unicode characters in Name", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()

        // Vietnamese letters plus an HTML tag: the tag must show as text, not make "QA" bold
        const name = "Trần Nam <b>QA</b>"
        const orderFilled = await orderBusiness.fillOrderForm({
            ...new IndexData.order().generateOrder(),
            name: name,
            "credit card": "4111111111111111",
        })
        await orderFixture.clickOnPurchase()

        // innerText drops tags that are rendered, so reading "<b>" back proves it was shown as plain text
        const purchaseSuccessInfor = await orderFixture.getPurchaseConfirmation()
        expect(purchaseSuccessInfor.name, "Name").toEqual(name)
        expect(purchaseSuccessInfor.cardNumber, "Card Number").toEqual(orderFilled["credit card"])
    })
    //TODO: PASSED
    test("OD-013 | Very long Name and Card (255 chars)", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()

        // The site has no length limit, so the purchase goes through with the full values
        const longName = "N".repeat(255)
        const longCard = "4".repeat(255)
        await orderBusiness.fillOrderForm({
            ...new IndexData.order().generateOrder(),
            name: longName,
            "credit card": longCard,
        })
        await orderFixture.clickOnPurchase()

        // The popup keeps the values whole
        const purchaseSuccessInfor = await orderFixture.getPurchaseConfirmation()
        expect(purchaseSuccessInfor.name, "Name").toEqual(longName)
        expect(purchaseSuccessInfor.cardNumber, "Card Number").toEqual(longCard)

        // No UI break: OK can still be clicked and takes the user back to the home page
        await orderFixture.clickOnConfirmPurchase()
    })
    //TODO: PASSED
    test("OD-014 | Cart unchanged after browser Back from purchase", async ({
        cartFixture,
        productDataFixture,
        orderFixture,
        orderBusiness,
        page,
    }) => {
        // add product to the cart
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        await cartFixture.clickOnPlaceOrder()

        // Complete the purchase; OK sends the browser to index.html
        await orderBusiness.fillOrderForm()
        await orderFixture.clickOnPurchase()
        await orderFixture.getPurchaseConfirmation()
        await orderFixture.clickOnConfirmPurchase()

        // Back returns to cart.html, which loads the cart again from the API
        await page.goBack()
        await expect(page).toHaveURL(/cart\.html/)

        // The site deleted the cart when Purchase was clicked, so the item must not come back
        await cartFixture.cartEmpty()
    })
    //TODO: PASSED
})
