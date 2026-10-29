import { mergeTests } from "@playwright/test"
import { test as mainTest } from "@fixture/01.main.fixture"
import { test as authTest } from "@fixture/02.auth.fixture"
import { test as businessTest } from "@fixture/05.business.fixture"
import { test as dataFixture } from "@fixture/06.data.fixture"
import { test as cartFixture } from "@fixture/03.cart.fixture"
import { test as apiFixture } from "@fixture/07.api.fixture"
import { test as orderFixture } from "@fixture/04.order.fixture"
export const test = mergeTests(mainTest, authTest, businessTest, dataFixture, cartFixture, orderFixture, apiFixture)

export { expect } from "@playwright/test"
