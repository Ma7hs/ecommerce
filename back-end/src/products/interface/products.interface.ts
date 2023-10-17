import { ProductType } from "@prisma/client";

export interface FilterProducts {
    name?: string,
    price?: {
        gte?: number,
        lte?: number
    },
    productType?: ProductType,
    preparationTime?: number,
    disponibility?: boolean
}