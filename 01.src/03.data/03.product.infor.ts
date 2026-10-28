export type productInforType = {
    name: string,
    price: string
}
export const productInfor = {
    samsungGalaxyS6: {
        name: "Samsung galaxy s6",
        price: "$360 *includes tax"
    },
    Nokialumia1520: {
        name: "Nokia lumia 1520",
        price: "$820 *includes tax"
    },
    // Laptops category
    sonyVaioI5: {
        name: "Sony vaio i5",
        price: "$790 *includes tax"
    },
    // Monitors category (on the second page of the home list)
    appleMonitor24: {
        name: "Apple monitor 24",
        price: "$400 *includes tax"
    }
} satisfies Record<string,productInforType>


export default productInfor