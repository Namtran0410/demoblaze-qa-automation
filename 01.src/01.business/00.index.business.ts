import { ApiAccountCreator } from "./01.account/01.api.account.creator";
import { UIAccountCreator } from "./01.account/02.ui.account.creator";
import ApiAuth from "./02.auth/00.api.auth";

export const IndexBusiness = {
    apiAccountCreator: ApiAccountCreator,
    uiAccountCreator: UIAccountCreator,
    authApi: ApiAuth
}
