import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { User } from 'src/users/decorator/user.decorator';
import { UserInfo } from 'src/users/interface/users.interface';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('favorites')
export class FavoritesController {

    constructor(private readonly favoriteService: FavoritesService){}

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("all-favorites-by-user")
    @Get()
    favoriteByUser(
        @User() user: UserInfo
    ){
        return this.favoriteService.getAllFavorites(user.id)
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @Post(':idProduct')
    createFavorite(
        @Param('idProduct', ParseIntPipe) idProduct: number,
        @User() user: UserInfo
    ){
        return this.favoriteService.createFavorite(user.id, idProduct)
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @Delete(':idProduct')
    deleteFavorite(
        @Param('idProduct', ParseIntPipe) idProduct: number,
        @User() user: UserInfo
    ){
        return this.favoriteService.deleteFavorite(user.id, idProduct)
    }

}
