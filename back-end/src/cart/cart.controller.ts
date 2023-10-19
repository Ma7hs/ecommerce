import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO, UpdateStatusCartDTO } from './dto/cart.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UserInfo } from 'src/users/interface/users.interface';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';


@Controller('carts-by-user')
export class CartController {
    constructor(private readonly cartsByUserService: CartService) { }

    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @Post()
    createCartByUser(
        @Body() { products, status }: CreateCartDTO,
        @User() user: UserInfo
    ) {
        return this.cartsByUserService.createCartByUser({ products, status }, user.id);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(1)
    @CacheKey("all-carts-by-user")
    @UseGuards(AuthGuard)
    @Get()
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    getAllCartsByUser(
        @User() user: UserInfo
    ) {
        return this.cartsByUserService.getCartsByUser(user.id)
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(1)
    @CacheKey("cart-by-id")
    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @Get(':id')
    getCartById(
        @Param("id", ParseIntPipe) id: number
    ){
        console.log(id)
        return this.cartsByUserService.getCartById(id)
    }


    @Roles(UserType.ADMIN, UserType.COLABORATOR)
    @UseGuards(AuthGuard)
    @Patch(':cartId')
    updateStatusCart(
        @Body() { status }: UpdateStatusCartDTO,
        @User() {id}: UserInfo,
        @Param('cartId', ParseIntPipe) cartId: number
    ) {
        return this.cartsByUserService.updateStatusCart({ id,cartId, status })
    }

}
