import OrderHelpers from "@infras/helpers/04.order.helpers"
import OrderGeneration from "@data/04.order-generation"
import { OrderInfo, orderFormField } from "@type/04.order.type"

export class OrderBusiness {
    constructor(private readonly orderHelpers: OrderHelpers) {}

    // Fills every input of the open Place order modal; without data, a random order is used.
    // Returns the data filled in, so the test can check it against the confirmation.
    async fillOrderForm(order: OrderInfo = new OrderGeneration().generateOrder()): Promise<OrderInfo> {
        for (const [field, value] of Object.entries(order) as [orderFormField, string][]) {
            await this.orderHelpers.fillField(field, value)
        }
        return order
    }
}

export default OrderBusiness
