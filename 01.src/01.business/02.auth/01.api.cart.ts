import { Account } from "@business/01.account/00.account.creator";
import { productInforType } from "@data/03.product.infor";
import { APIRequestContext, expect } from "@playwright/test";

export class ApiCart {
    constructor(private readonly request: APIRequestContext){}
    async getAllProductInfor(){
        const request = await this.request.get(`${process.env.API_URL}/entries`)
        const res = await request.json()

    }
    async addToCart(product: productInforType){
        const request = await this.request.post(`${process.env.API_URL}/addtocart`, {
            data: {},
            
        })
    }
}