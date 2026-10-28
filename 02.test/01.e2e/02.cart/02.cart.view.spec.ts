import {test, expect} from "@fixture/00.index.fixture"
import { env } from "@config/env"
import MainHelpers from "@infras/01.helpers/01.main.helpers"
import AuthHelpers from "@infras/01.helpers/02.login.helpers"
import CartHelpers from "@infras/01.helpers/03.cart.helpers"

test.describe("Cart | Cart modal", ()=>{
    test.beforeEach("Navigation to main page", async({mainFixture})=> {
        await mainFixture.goto()
    })

    test("CT-009 | Cart table structure", async({
        cartFixture,
        mainFixture,
        productDataFixture
    })=>{
        await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await mainFixture.goToNav("Cart")
        await cartFixture.tableStructureVisible()

    })
    //TODO: PASSED
    test("CT-010 | Cart price matches product page price", async({
        cartFixture,
        mainFixture,
        productDataFixture
    })=>{
        await mainFixture.getProductPrice(productDataFixture.samsungGalaxyS6.name)
        const addToCartPrice = await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        const billPrice = await cartFixture.singlePriceInTable()
        expect(addToCartPrice).toEqual(billPrice)
    })
    //TODO: PASSED

    test("CT-011 | Products from different categories", async({
        cartFixture,
        mainFixture,
        productDataFixture
    })=>{
        await mainFixture.getProductPrice(productDataFixture.samsungGalaxyS6.name)
        const addToCartPrice = await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        const billPrice = await cartFixture.cartTotalPrice()
        expect(addToCartPrice).toEqual(billPrice)
    })
    //TODO: PASSED
    test("CT-012 | Products from different categories", async({
        cartFixture,
        mainFixture,
        productDataFixture
    })=>{
        await mainFixture.getProductPrice(productDataFixture.samsungGalaxyS6.name)
        const addToCartPrice = await cartFixture.addProductToCart(productDataFixture.samsungGalaxyS6)
        await cartFixture.addToCartSuccessful([productDataFixture.samsungGalaxyS6])
        const billPrice = await cartFixture.cartTotalPrice()
        expect(addToCartPrice).toEqual(billPrice)
    })
    //TODO: PASSED
})
