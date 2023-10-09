import { ProductType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'


export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  photo: string;

  preparationTime: number;

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}

export class ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  photo: string;
  preparationTime: number;
  productType: ProductType;

  constructor(partial: Partial<ProductResponseDTO>) {
    Object.assign(this, partial)
  }
}


export class ProductTypeResponseDTO {
  id: number;
  type: string;

  constructor(partial: Partial<ProductTypeResponseDTO>) {
    Object.assign(this, partial)
  }
}

