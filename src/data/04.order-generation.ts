import { faker } from "@faker-js/faker"
import { OrderInfo } from "@type/04.order.type"

export class OrderGeneration {
    // The site checks only that Name and Credit card are not empty, so any text is accepted
    generateOrder(): OrderInfo {
        return {
            name: faker.person.fullName(),
            country: faker.location.country(),
            city: faker.location.city(),
            "credit card": faker.finance.creditCardNumber(),
            month: String(faker.number.int({ min: 1, max: 12 })),
            year: String(faker.date.future({ years: 5 }).getFullYear()),
        }
    }
}

export default OrderGeneration
