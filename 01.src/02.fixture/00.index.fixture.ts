import { mergeTests } from "@playwright/test";
import { test as mainTest } from "@fixture/01.main.fixture";
import {test as authTest} from "@fixture/02.login.fixture"
import { test as businessTest } from "@fixture/03.business.fixture";
import {test as dataFixture} from "@fixture/04.data.fixture"
import {test as cartFixture} from "@fixture/05.cart.fixture"
import { test as apiFixture } from "@fixture/06.api.fixture"

export const test = mergeTests(
    mainTest, 
    authTest, 
    businessTest,
    dataFixture,
    cartFixture,
    apiFixture
)

export { expect } from "@playwright/test"
