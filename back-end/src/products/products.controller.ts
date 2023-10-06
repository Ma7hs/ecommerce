import { Controller, Post, Body, Get, Put, Param, Delete, Patch, ParseIntPipe, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDTO, ProductTypeResponseDTO, ProductResponseDTO } from './dto/products.dto';
import { AuthGuard } from '../guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { ProductType, UserType } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Body() productData: ProductDTO): Promise<ProductDTO> {
        return this.productService.create(productData);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("all-products")
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @Get()
    async findAll(
        @Query('productType') productType?: ProductType,
        @Query('name') name?: string,
        @Query('preparationTime') preparationTime?: number,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string
    ): Promise<ProductDTO[]> {
        const price = minPrice || maxPrice ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) })
        } : undefined

        const filters = {
            ...(productType && { productType }),
            ...(name && { name }),
            ...(preparationTime && { preparationTime}),
            ...(price && { price }),
        }
        return this.productService.findAll(filters);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("filter-products")
    @Get("/types")
    findAllTypes(): Promise<ProductTypeResponseDTO[]>{
        return this.productService.findAllFoodTypes();
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() productData: ProductDTO): Promise<ProductDTO | null> {
        return this.productService.update(id, productData);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO | null> {
        return this.productService.remove(id);
    }
    
}