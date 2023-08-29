import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {

    constructor(private readonly FavoriteService: FavoritesService){}

    @Get(':id')
    favoriteById(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.FavoriteService.getAllFavorites(id)
    }

    @Post(':idCustomer/:idProduct')
    createFavorite(
        @Param('idCustomer', ParseIntPipe) idCustomer: number,
        @Param('idProduct', ParseIntPipe) idProduct: number
    ){
        return this.FavoriteService.createFavorite(idCustomer, idProduct)
    }

    @Delete(':idCustomer/:idProduct')
    deleteFavorite(
        @Param('idCustomer', ParseIntPipe) idCustomer: number,
        @Param('idProduct', ParseIntPipe) idProduct: number
    ){
        return this.FavoriteService.deleteFavorite(idCustomer, idProduct)
    }

}
