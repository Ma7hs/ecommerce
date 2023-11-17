import { StatusCart } from "@prisma/client";

export interface CreateCartParams{
    status: StatusCart,
    products: product[],
    preparationTime: number,
}

class product {
    product: number;
    qntd: number
}

export interface UpdateCartStatus{
    cartId: number,
    status: StatusCart
}
