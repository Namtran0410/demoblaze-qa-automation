export type orderFormField = "name" | "country" | "city" | "credit card" | "month" | "year"

// One value for every input of the Place order form
export type OrderInfo = Record<orderFormField, string>

// The lines of the "Thank you for your purchase!" popup
export type PurchaseConfirmation = {
    id: string
    amount: string
    cardNumber: string
    name: string
    date: string
}
