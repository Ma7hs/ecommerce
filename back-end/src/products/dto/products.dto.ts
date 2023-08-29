import { ProductType } from '@prisma/client';
import { IsEnum, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'


export class ProductDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsLowercase()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsLowercase()
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
  