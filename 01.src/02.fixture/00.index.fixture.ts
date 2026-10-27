import { mergeTests } from "@playwright/test";
import { test as mainTest } from "@fixture/01.main.fixture";
import {test as authTest} from "@fixture/02.login.fixture"
import { test as accountTest } from "@fixture/03.account.fixture";
import {test as dataFixture} from "@fixture/04.data.fixture"


export const test = mergeTests(
    mainTest, 
    authTest, 
    accountTest,
    dataFixture
)

export { expect } from "@playwright/test"
