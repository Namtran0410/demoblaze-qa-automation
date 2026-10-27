import { test as base } from "@playwright/test";
import { Account, AccountCreator } from "@business/01.account/00.account.creator";
import IndexPage from "@infras/00.pages/00.index.page";
import UserGeneration from "@data/01.user.generation";
import { IndexBusiness } from "@business/00.index.business";

type BusinessFixtures = {
    // Which strategy creates accounts; switch per file with test.use({ accountCreation: "ui" })
    accountCreation: "api" | "ui"
    accountCreator: AccountCreator
    // A freshly registered account for the test
    account: Account
    authApi: InstanceType<typeof IndexBusiness.authApi>
}

export const test = base.extend<BusinessFixtures>({
    accountCreation: ["api", { option: true }],
    accountCreator: async ({ accountCreation, request, page }, use) => {
        await use(accountCreation === "api"
            ? new IndexBusiness.apiAccountCreator(request)
            : new IndexBusiness.uiAccountCreator(new IndexPage(page)))
    },
    account: async ({ accountCreator }, use) => {
        await use(await accountCreator.create(new UserGeneration().generateAccount()))
    },
    authApi: async ({ request }, use) => {
        await use(new IndexBusiness.authApi(request))
    },
})
