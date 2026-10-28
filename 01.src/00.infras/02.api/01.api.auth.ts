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

    // The site sends the password base64-encoded, so do the same
    private async login(account: Account) {
        return this.request.post(`${process.env.API_URL}/login`, {
            data: {
                username: account.username,
                password: Buffer.from(account.password).toString("base64")
            }
        })
    }

    // Returns the auth token from the 'Auth_token: <token>' body
    async loginSuccess(account: Account): Promise<string> {
        const response = await this.login(account)
        expect(response.status()).toEqual(200)
        const body = await response.json()
        expect(body, "login should answer 'Auth_token: <token>'").toMatch(/^Auth_token: \S+$/)
        return body.replace("Auth_token: ", "")
    }

    async loginFailure(account: Account, expected: typeof LoginError[keyof typeof LoginError]) {
        const response = await this.login(account)
        expect(response.status()).toEqual(expected.status)
        expect(await response.json()).toEqual({errorMessage: expected.errorMessage})
    }
}

export default ApiAuth
