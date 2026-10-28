import { test, expect } from "@fixture/index"

test.describe("Smoke | Navigation to the main page", () => {
    test("SMK-001 | Navigation successful to the main page", async ({ mainFixture }) => {
        await mainFixture.goto()
    })
})
