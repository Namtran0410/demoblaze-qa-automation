import { test as base } from "@playwright/test";
import { indexHelpers } from "@infras/01.helpers/00.index.helpers";


type MainFixtures = {
    mainFixture: InstanceType<typeof indexHelpers.mainHelpers>
}

export const test = base.extend<MainFixtures>({
    mainFixture: async({page}, use) => {
        await use(new indexHelpers.mainHelpers(page))
    }
})