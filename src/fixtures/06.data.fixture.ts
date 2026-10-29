import IndexData from "@data/00.index"
import { test as base } from "@playwright/test"

type DataFixture = {
    userDataFixture: InstanceType<typeof IndexData.user>
    productDataFixture: typeof IndexData.productInfor
}

export const test = base.extend<DataFixture>({
    // use() must be awaited, or the fixture is torn down before the test finishes
    userDataFixture: async ({}, use) => {
        await use(new IndexData.user())
    },
    productDataFixture: async ({}, use) => {
        await use(IndexData.productInfor)
    },
})
