import { mergeTests } from "@playwright/test"
import { test as mainTest } from "@fixture/main.fixture"
import { test as authTest } from "@fixture/auth.fixture"
import { test as businessTest } from "@fixture/business.fixture"
import { test as dataFixture } from "@fixture/data.fixture"
import { test as cartFixture } from "@fixture/cart.fixture"
import { test as apiFixture } from "@fixture/api.fixture"

export const test = mergeTests(mainTest, authTest, businessTest, dataFixture, cartFixture, apiFixture)

export { expect } from "@playwright/test"
