import {test, expect} from "@fixture/00.index.fixture"
import { faker } from "@faker-js/faker"

test.describe("Login | Login modal", ()=>{

    test("CT-012 | API | Guest cart is not shared between sessions", async({
        cartApi
    })=> {
        const product = await cartApi.getSingleProductInfor('Samsung galaxy s6')
        const { cookie: guestA } = await cartApi.addItemToCart(product.id)

        // Guest A sees the item, so the add really worked
        const cartA = await cartApi.viewCart(guestA)
        expect(cartA.items.map(line => line.prod_id)).toContain(product.id)

        const otherGuestCart = await cartApi.viewCart(cartApi.newGuestCookie())
        expect(otherGuestCart.items).toEqual([])
    })
    //TODO: PASSED
    test("CT-014 | API | Delete with invalid item id (API)", async({
        cartApi
    })=> {
        const product = await cartApi.getSingleProductInfor('Samsung galaxy s6')

        // Add item to cart
        const {lineId, cookie} = await cartApi.addItemToCart(product.id, cartApi.newGuestCookie())

        // delete an id that is not in any cart: no server error (deleteItem checks the response is OK)
        await cartApi.deleteItem(faker.string.uuid(), cookie)

        // the existing item is not removed
        const cart = await cartApi.viewCart(cookie)
        expect(cart.items.map(line => line.id)).toEqual([lineId])
    })
    //TODO: PASSED
    test("CT-015 | API | Add many items", async({
        cartApi
    })=> {
        // add item to cart
        const products = await cartApi.getAllProductInfor()
        const listProductsId = products.map(item=> item.id)
        const cookie = cartApi.newGuestCookie()
        for(let id of listProductsId) {
            await cartApi.addItemToCart(id, cookie)
        }

        // Check cart
        const addedItems = await cartApi.viewCart(cookie)
        expect(addedItems.items.length).toEqual(listProductsId.length)
    })
    //TODO: PASSED
    test("CT-018 | API | Add / view / delete cart item via API", async({
        cartApi, productDataFixture
    })=> {
        // add item to cart
        const product = await cartApi.getSingleProductInfor(productDataFixture.samsungGalaxyS6.name)
        const cookie = cartApi.newGuestCookie()
        // lineId is the id of this cart line; deleteItem needs it
        const { lineId } = await cartApi.addItemToCart(product.id, cookie)

        // Check cart
        const addedItems = await cartApi.viewCart(cookie)
        expect(addedItems.items.length).toEqual(1)
        expect(addedItems.items[0].prod_id).toEqual(product.id)

        //delete cart
        await cartApi.deleteItem(lineId, cookie)
        const deletedItems = await cartApi.viewCart(cookie)
        expect(deletedItems.items.length).toEqual(0)
    })
    //TODO: PASSED
})
