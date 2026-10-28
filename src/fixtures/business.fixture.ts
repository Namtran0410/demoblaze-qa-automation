import { test as base } from "@playwright/test"
import { Account, AccountCreator } from "@business/account/account-creator"
import IndexPage from "@infras/pages/index"
import UserGeneration from "@data/user-generation"
import { IndexBusiness } from "@business/index"

type BusinessFixtures = {
    // Which strategy creates accounts; switch per file with test.use({ accountCreation: "ui" })
    accountCreation: "api" | "ui"
    accountCreator: AccountCreator
    // A freshly registered account for the test
    account: Account
}

export const test = base.extend<BusinessFixtures>({
    accountCreation: ["api", { option: true }],
    accountCreator: async ({ accountCreation, request, page }, use) => {
        await use(
            accountCreation === "api"
                ? new IndexBusiness.apiAccountCreator(request)
                : new IndexBusiness.uiAccountCreator(new IndexPage(page)),
        )
    },
    account: async ({ accountCreator }, use) => {
        await use(await accountCreator.create(new UserGeneration().generateAccount()))
    },
})
