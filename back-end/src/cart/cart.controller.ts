import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResponseDTO, CreateCartDTO, UpdateStatusCartDTO } from './dto/cart.dto';


@Controller('carts-by-user')
export class CartController {
    constructor(private readonly cartsByUserService: CartService) { }

    @Post(':id')
    createCartByUser(
        @Body() {products, status}: CreateCartDTO,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cartsByUserService.createCartByUser({products, status}, id);
    }

    @Get(':id')
    getAllCartsByUser(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cartsByUserService.getCartsByUser(id)
    }

    @Patch(':id/:cartId')
    updateStatusCart(
        @Body() { status }: UpdateStatusCartDTO,
        @Param('id', ParseIntPipe) userId: number,
        @Param('cartId', ParseIntPipe) cartId: number
    ) {
        return this.cartsByUserService.updateStatusCart({ userId, cartId, status })
    }

}
