import { Injectable } from '@nestjs/common';
import {ProductDTO} from './dto/products.dto'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prisma:PrismaService){}

  async create(data: ProductDTO): Promise<ProductDTO> {
    return this.prisma.product.create({ data });
  }

  async findAll(): Promise<ProductDTO[]> {
    return this.prisma.product.findMany();
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