// One item of GET /entries
export type Product = {
    id: number
    title: string
    price: number
    cat: string
    desc: string
    img: string
}
// One line of POST /viewcart
export type cartView = {
    cookie: string
    id: string
    prod_id: number
}

// Every cart call returns the cookie it used, so the next call can work on the same cart
export type CartResult<T> = T & { cookie: string }
