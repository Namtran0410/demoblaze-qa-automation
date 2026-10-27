import { test as base } from "@playwright/test";
import { Account, AccountCreator } from "@business/01.account/00.account.creator";
import { ApiAccountCreator } from "@business/01.account/01.api.account.creator";
import { UIAccountCreator } from "@business/01.account/02.ui.account.creator";
import IndexPage from "@infras/00.pages/00.index.page";
import UserGeneration from "@data/01.user.generation";
import { IndexBusiness } from "@business/00.index.business";

type AccountFixtures = {
    // Which strategy creates accounts; switch per file with test.use({ accountCreation: "ui" })
    accountCreation: "api" | "ui"
    accountCreator: AccountCreator
    // A freshly registered account for the test
    account: Account
}

export const test = base.extend<AccountFixtures>({
    accountCreation: ["api", { option: true }],
    accountCreator: async ({ accountCreation, request, page }, use) => {
        await use(accountCreation === "api"
            ? new ApiAccountCreator(request)
            : new UIAccountCreator(new IndexPage(page)))
    },
    account: async ({ accountCreator }, use) => {
        await use(await accountCreator.create(new UserGeneration().generateAccount()))
    },
})
