import { Account } from "@business/01.account/00.account.creator";
import { APIRequestContext, expect } from "@playwright/test";

export const LoginError = {
    wrongPassword: {
        status: 200, 
        errorMessage: "Wrong password." 
    },
    userNotExist:  { 
        status: 200, 
        errorMessage: "User does not exist." 
    },
} as const

export class ApiAuth {
    constructor(private readonly request: APIRequestContext){}
    async login(account: Account, expected: typeof LoginError[keyof typeof LoginError] ) {
        const response = await this.request.post(
            process.env.BASE_URL as string,
        {
            data: {
                data: {
                    username: account.username, 
                    password: Buffer.from(account.password).toString("base64")}
            }
        }
        )
        expect(response.status()).toEqual(expected.status)
        expect(response.json()).toEqual({errorMessage: expected.errorMessage})
    }
}

export default ApiAuth