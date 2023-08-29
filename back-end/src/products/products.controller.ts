import {
    Controller, Post, Body, Get, Put, Param, Delete
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDTO } from './dto/products.dto'

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async create(
        @Body() productData: ProductDTO): Promise<ProductDTO> {
        return this.productService.create(productData);
    }

    @Get()
    async findAll(): Promise<ProductDTO[]> {
        return this.productService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() productData: ProductDTO): Promise<ProductDTO | null> {
        return this.productService.update(id, productData);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<ProductDTO | null> {
        return this.productService.remove(id);
    }
    
}