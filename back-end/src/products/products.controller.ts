import { Controller, Post, Body, Get, Put, Param, Delete, Patch, ParseIntPipe, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductTypeResponseDTO, ProductResponseDTO, ProductDTO } from './dto/products.dto';
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
        @Body() productData: ProductDTO) {
        console.log(productData);
        console.log(productData.preparationTime)
        return this.productService.create(productData);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(1)
    @CacheKey("all-products")
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @Get()
    async findAll(
        @Query('productType') productType?: ProductType,
        @Query('name') name?: string,
        @Query('preparationTime') preparationTime?: number,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('disponibility') disponibility?: boolean
    ): Promise<any> {
        const price = minPrice || maxPrice ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) })
        } : undefined

        const filters = {
            ...(productType && { productType }),
            ...(name && { name }),
            ...(preparationTime && { preparationTime}),
            ...(price && { price }),
            ...(disponibility && { disponibility })
        }
        return this.productService.findAll(filters);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(1)
    @CacheKey("filter-products")
    @Get("/types")
    findAllTypes(): Promise<ProductTypeResponseDTO[]>{
        return this.productService.findAllFoodTypes();
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(1)
    @CacheKey("product")
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @Get(":id")
    async getById(
        @Param("id", ParseIntPipe) id: number
    ){
        return this.productService.findUnique(id);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() productData: any){
        console.log(id)
        return this.productService.update(id, productData);
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.productService.remove(id);
    }
    
}