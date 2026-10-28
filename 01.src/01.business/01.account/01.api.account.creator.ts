import { Account, AccountCreator } from "@business/01.account/00.account.creator";
import { APIRequestContext, expect } from "@playwright/test";

export class ApiAccountCreator implements AccountCreator {
    constructor(private readonly request: APIRequestContext){}
    async create(account: Account): Promise<Account> {
        const response = await this.request.post(
            `${process.env.API_URL}/signup`,
            {
                // The site sends the password base64-encoded, so do the same or UI login will fail
                data: {
                    username: account.username, 
                    password: Buffer.from(account.password).toString("base64")
                }
            }
        )
        expect(response.ok()).toBeTruthy()
        // A taken username still answers 200, with { errorMessage } in the body
        const body = await response.text()
        expect(body, `Sign up failed for "${account.username}"`).not.toContain("errorMessage")
        return account
    }
}
