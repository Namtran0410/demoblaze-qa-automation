import { faker } from "@faker-js/faker"
import { APIRequestContext, expect } from "@playwright/test"
import { Product, cartView, CartResult } from "@type/03.cart.type"

export class ApiCart {
    constructor(private readonly request: APIRequestContext) {}
    // /entries returns only the first page (9 products); the rest needs POST /pagination
    async getAllProductInfor(): Promise<Product[]> {
        const response = await this.request.get(`${process.env.API_URL}/entries`)
        expect(response.ok()).toBeTruthy()
        const body: { Items: Product[] } = await response.json()
        return body.Items
    }
    async getSingleProductInfor(title: string): Promise<Product> {
        const allProduct = await this.getAllProductInfor()
        const itemInfor = allProduct.find((item) => item.title === title)
        expect(itemInfor, `product "${title}" not found`).toBeDefined()
        return itemInfor!
    }
    // A guest cart is identified by a random "user" cookie, so any new uuid gives a fresh empty cart
    newGuestCookie(): string {
        return `user=${faker.string.uuid()}`
    }

    // Guests send "user=<uuid>" with flag false; a logged-in user sends the auth token with flag true
    private flagOf(cookie: string): boolean {
        return !cookie.startsWith("user=")
    }

    // Without a cookie, a new guest cart is created; reuse the returned cookie to add to the same cart.
    // lineId is the cart line id, which deleteItem needs to remove this line.
    async addItemToCart(
        productId: number,
        cookie: string = this.newGuestCookie(),
    ): Promise<CartResult<{ lineId: string }>> {
        const lineId = faker.string.uuid()
        const response = await this.request.post(`${process.env.API_URL}/addtocart`, {
            data: {
                id: lineId,
                cookie: cookie,
                prod_id: productId,
                flag: this.flagOf(cookie),
            },
        })
        expect(response.ok()).toBeTruthy()
        return { cookie, lineId }
    }

    async viewCart(cookie: string): Promise<CartResult<{ items: cartView[] }>> {
        const response = await this.request.post(`${process.env.API_URL}/viewcart`, {
            data: {
                cookie: cookie,
                flag: this.flagOf(cookie),
            },
        })
        expect(response.ok()).toBeTruthy()
        const body: { Items: cartView[] } = await response.json()
        return { cookie, items: body.Items }
    }
    // /deleteitem only needs the line id; the cookie is passed through so the caller can view the same cart next
    async deleteItem(lineId: string, cookie: string): Promise<CartResult<{ lineId: string }>> {
        const response = await this.request.post(`${process.env.API_URL}/deleteitem`, {
            data: { id: lineId },
        })
        expect(response.ok()).toBeTruthy()
        return { cookie, lineId }
    }
}

export default ApiCart
