import { test as base } from "@playwright/test"
import { indexHelpers } from "@infras/helpers/00.index"

type AuthFixture = {
    authFixture: InstanceType<typeof indexHelpers.authHelpers>
}

export const test = base.extend<AuthFixture>({
    authFixture: async ({ page }, use) => {
        await use(new indexHelpers.authHelpers(page))
    },
})
