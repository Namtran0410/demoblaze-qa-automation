import { faker } from "@faker-js/faker"
import { Account } from "@business/account/account-creator"

export class UserGeneration {
    generateUserName(length: number = 5) {
        return faker.string.alphanumeric(length)
    }

    generatePassword(length: number = 10) {
        return faker.internet.password({ length })
    }

    // demoblaze rejects a username that already exists, so a timestamp keeps it unique
    generateAccount(): Account {
        return {
            username: `qa_${this.generateUserName(8)}_${Date.now()}`,
            password: this.generatePassword(),
        }
    }
}

export default UserGeneration
