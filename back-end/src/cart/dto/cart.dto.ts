import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Product, StatusCart } from '@prisma/client'; // Certifique-se de importar o enum StatusCart

export class CreateCartDTO {
  @IsEnum(StatusCart)
  status: StatusCart = 'ACTIVE'

  @IsNotEmpty()
  @IsArray()
  products: ProductDTO[]; // Array de IDs de produtos
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

