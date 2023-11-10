import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CartService } from '../cart.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('carts-with-time')
export class TimingController {

    constructor(private readonly cartService: CartService){}

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("carts-with-time")
    @Get()
    getCartsWithPreparationTime(){
        return this.cartService.getCartWithPreparationTime()
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("carts-disabled")
    @Get("carts-disable")
    getCartsFinished(){
        return this.cartService.getCartWithStatusDisable()
    }

}
