export type Account = {
    username: string,
    password: string
}
export interface AccountCreator {
    create(account: Account): Promise<Account>
}
