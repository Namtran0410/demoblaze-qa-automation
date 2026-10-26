import {test, expect} from "@fixture/00.index.fixture"

test.describe("Smoke | Navigation to the main page", async()=>{
    test("SMK-001 | Navigation successful to the main page", async({mainFixture})=>{
        await mainFixture.goto()
    })
})