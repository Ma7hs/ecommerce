import { Injectable, NotFoundException } from '@nestjs/common';
import {ProductDTO, ProductResponseDTO} from './dto/products.dto'
import { PrismaService } from '../prisma/prisma.service';
import {FilterProducts} from './interface/products.interface'

const selectProducts = {
  id: true,
  name: true,
  description: true,
  price: true,
  photo: true,
  productType: true,
  preparationTime: true,
}

@Injectable()
export class ProductService {

    constructor(private readonly prisma:PrismaService){}

  async create(data: ProductDTO): Promise<ProductDTO> {
    return this.prisma.product.create({ data });
  }

  async findAll(filters: FilterProducts): Promise<ProductDTO[]> {
    const products = await this.prisma.product.findMany({
      select: {
        ...selectProducts,
      },
      where: filters
    });

    if(!products){
      throw new NotFoundException()
    };

    return products.map((products) => { return new ProductResponseDTO(products) })
  }

  async findOne(id: number): Promise<ProductDTO | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, data: ProductDTO): Promise<ProductDTO | null> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: number): Promise<ProductDTO | null> {
    return this.prisma.product.delete({ where: { id } });
  }
}