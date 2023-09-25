import { Controller, Post, Body, Get, Put, Param, Delete, Patch, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDTO } from './dto/products.dto'
import { AuthGuard } from '../guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Body() productData: ProductDTO): Promise<ProductDTO> {
        console.log(productData);
        return this.productService.create(productData);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("all-products")
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @Get()
    async findAll(): Promise<ProductDTO[]> {
        return this.productService.findAll();
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() productData: ProductDTO): Promise<ProductDTO | null> {
        return this.productService.update(id, productData);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO | null> {
        return this.productService.remove(id);
    }
    
}