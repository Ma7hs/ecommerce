import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO, UpdateStatusCartDTO } from './dto/cart.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UserInfo } from 'src/users/interface/users.interface';


@Controller('carts-by-user')
export class CartController {
    constructor(private readonly cartsByUserService: CartService) { }

    @Post()
    createCartByUser(
        @Body() { products, status }: CreateCartDTO,
        @User() user: UserInfo
    ) {
        console.log({ user })
        return this.cartsByUserService.createCartByUser({ products, status }, user.id);
    }

    @Get()
    getAllCartsByUser(
        @User() user: UserInfo
    ) {
        return this.cartsByUserService.getCartsByUser(user.id)
    }


    @Patch(':cartId')
    updateStatusCart(
        @Body() { status }: UpdateStatusCartDTO,
        @User() {id}: UserInfo,
        @Param('cartId', ParseIntPipe) cartId: number
    ) {
        return this.cartsByUserService.updateStatusCart({ id,cartId, status })
    }

}
