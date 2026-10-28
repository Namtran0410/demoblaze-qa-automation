import IndexData  from "@data/00.index.data";
import { test as base } from "@playwright/test";

type DataFixture = {
    userDataFixture: InstanceType<typeof IndexData.user>,
    productDataFixture: typeof IndexData.productInfor
}

export const test = base.extend<DataFixture>({
    userDataFixture: ({}, use)=> {
        use(new IndexData.user())
    },
    productDataFixture: ({}, use)=>{
        use(IndexData.productInfor)
    }
})