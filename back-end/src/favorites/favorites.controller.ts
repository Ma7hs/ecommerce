import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { User } from 'src/users/decorator/user.decorator';
import { UserInfo } from 'src/users/interface/users.interface';

@Controller('favorites')
export class FavoritesController {

    constructor(private readonly FavoriteService: FavoritesService){}

    @Get()
    favoriteById(
        @User() user: UserInfo
    ){
        return this.FavoriteService.getAllFavorites(user.id)
    }

    @Post(':idProduct')
    createFavorite(
        @Param('idProduct', ParseIntPipe) idProduct: number,
        @User() user: UserInfo
    ){
        return this.FavoriteService.createFavorite(user.id, idProduct)
    }

    @Delete(':idProduct')
    deleteFavorite(
        @Param('idProduct', ParseIntPipe) idProduct: number,
        @User() user: UserInfo
    ){
        return this.FavoriteService.deleteFavorite(user.id, idProduct)
    }

}
