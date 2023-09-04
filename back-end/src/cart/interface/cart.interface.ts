import { StatusCart } from "@prisma/client";

export interface CreateCartParams{
    status: StatusCart,
    products: product[]
}

class product {
    product: number;
    qntd: number
}

export interface UpdateCartStatus{
    cartId: number,
    userId: number,
    status: StatusCart
}