import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Product, StatusCart } from '@prisma/client';

export class CreateCartDTO {
  @IsOptional()
  @IsEnum(StatusCart)
  status: StatusCart = 'ACTIVE'

  @IsNotEmpty()
  @IsArray()
  products: ProductDTO[];

  @IsOptional()
  preparationTime: number;
}

class ProductDTO {
  @IsNotEmpty()
  @IsNumber({}, { each: true, message: 'Product IDs must be numbers.' })
  product: number;

  @IsNotEmpty()
  @IsNumber({}, { each: true, message: 'Quantity must be numbers.' })
  qntd: number;
}

export class UpdateStatusCartDTO{
  @IsNotEmpty()
  @IsEnum(StatusCart)
  status: StatusCart
}

export class CartResponseDTO {
  status: StatusCart;
  products: Product[];

  constructor(partial: Partial<CartResponseDTO>) {
    Object.assign(this, partial)
}
}

