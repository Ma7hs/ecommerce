import { ProductType } from "@prisma/client";

export interface FilterProducts{
    productType?: ProductType,
    name?: string,
    price?: number,
    
}