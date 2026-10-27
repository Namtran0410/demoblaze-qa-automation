import IndexData  from "@data/00.index.data";
import { test as base } from "@playwright/test";

type DataFixture = {
    userData: InstanceType<typeof IndexData.user>
}

export const test = base.extend<DataFixture>({
    userData: ({}, use)=> {
        use(new IndexData.user())
    }
})