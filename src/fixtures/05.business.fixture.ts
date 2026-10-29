import { test as base } from "@playwright/test"
import { Account, AccountCreator } from "@type/01.account.type"
import IndexPage from "@infras/pages/00.index"
import UserGeneration from "@data/01.user-generation"
import { IndexBusiness } from "@business/00.index"
import OrderHelpers from "@infras/helpers/04.order.helpers"

type BusinessFixtures = {
    // Which strategy creates accounts; switch per file with test.use({ accountCreation: "ui" })
    accountCreation: "api" | "ui"
    accountCreator: AccountCreator
    // A freshly registered account for the test
    account: Account
    // Same, but through the API only: no browser page, so the api project does not need a browser installed
    apiAccountCreator: AccountCreator
    apiAccount: Account
    orderBusiness: InstanceType<typeof IndexBusiness.orderBusiness>
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
    // accountCreator always asks for a page (the UI strategy needs one), which launches a browser even for the API strategy
    apiAccountCreator: async ({ request }, use) => {
        await use(new IndexBusiness.apiAccountCreator(request))
    },
    apiAccount: async ({ apiAccountCreator }, use) => {
        await use(await apiAccountCreator.create(new UserGeneration().generateAccount()))
    },
    orderBusiness: async ({ page }, use) => {
        await use(new IndexBusiness.orderBusiness(new OrderHelpers(page)))
    },
})
