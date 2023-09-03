import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Product, StatusCart } from '@prisma/client'; // Certifique-se de importar o enum StatusCart

export class CreateCartDTO {
  @IsEnum(StatusCart)
  status: StatusCart = 'ACTIVE'

  @IsNotEmpty()
  @IsNumber({}, { each: true, message: 'Product IDs must be numbers.' })
  products: number[]; // Array de IDs de produtos
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

