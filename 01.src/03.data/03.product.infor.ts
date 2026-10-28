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
    }
} satisfies Record<string,productInforType>


export default productInfor