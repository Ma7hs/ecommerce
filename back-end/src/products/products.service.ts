import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductResponseDTO, ProductTypeResponseDTO, ProductDTO } from './dto/products.dto';
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
  disponibility: true
}

const selectProductTypes = {
  id: true,
  type: true
}

@Injectable()
export class ProductService {

    constructor(private readonly prisma:PrismaService){}

  async create(data: ProductDTO): Promise<any> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        photo: data.photo,
        price: data.price,
        productType: data.productType,
        preparationTime: data.preparationTime,
        disponibility: data.disponibility
      }
     });
  }

  async findAll(filters: FilterProducts): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      select: {
        ...selectProducts,
      },
      where: filters
    });

    if(!products){
      throw new NotFoundException()
    };

    return products.map((product) => { return new ProductResponseDTO(product)})
  }

  async findUnique(id: number){
    const product = await this.prisma.product.findFirst({
      select: {
        ...selectProducts
      },
      where: {
        id
      }
    })

    if(!product){
      throw new NotFoundException()
    }

    return product
  }

  async findAllFoodTypes(): Promise<ProductTypeResponseDTO[]>{
    const types = await this.prisma.productTypeFilter.findMany({
      select: {
        ...selectProductTypes
      }
    })

    if(!types){
      throw new NotFoundException()
    }
    return types.map((type) => { return new ProductTypeResponseDTO(type)})
  }

  async update(id: number, data: any){
    return await this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    const product =  await this.prisma.product.findUnique({ where: { id: id } });
    
    if(!product){
      throw new NotFoundException()
    }

    await this.prisma.product.delete({where: {id: product.id}})
    
    return product
  }
}