import { StatusCart } from "@prisma/client";

export interface CreateCartParams{
    status: StatusCart;
    products: number[]
}

export interface UpdateCartStatus{
    cartId: number,
    userId: number,
    status: StatusCart
}