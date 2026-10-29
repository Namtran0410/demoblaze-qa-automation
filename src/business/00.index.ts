import { ApiAccountCreator } from "@business/account/01.api-account-creator"
import { UIAccountCreator } from "@business/account/02.ui-account-creator"
import { OrderBusiness } from "@business/order/01.order-business"
export const IndexBusiness = {
    apiAccountCreator: ApiAccountCreator,
    uiAccountCreator: UIAccountCreator,
    orderBusiness: OrderBusiness,
}
