import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponseDTO } from './dto/favorites.dto';

@Injectable()
export class FavoritesService {

    constructor(private readonly prismaService: PrismaService){}

    async getAllFavorites(id: number){
        const client = await this.prismaService.customer.findUnique({
            where: {
                id: id
            }
        })

        if(!client){
            throw new NotFoundException()
        }

        const favorites = await this.prismaService.favorite.findMany({
            where: {
                customerId: client.id
            },
            select: {
                product: {
                    select: {
                        name: true,
                        photo: true,
                        price: true
                    }
                },
            }
        })

        return favorites

    }

    async createFavorite(idCustomer: number, idProduct: number){
        const client = await this.prismaService.customer.findUnique({
            where: {
                id: idCustomer
            }
        })

        if(!client){
            throw new NotFoundException()
        }

        const product = await this.prismaService.product.findUnique({
            where: {
                id: idProduct
            }
        })

        return this.prismaService.favorite.create({
            data: {
                productId: product.id,
                customerId: idCustomer
            }
        })

    }

    async deleteFavorite(idCustomer: number, idProduct: number){
        const client = await this.prismaService.customer.findUnique({
            where: {
                id: idCustomer
            }
        })

        if(!client){
            throw new NotFoundException()
        }

        await this.prismaService.favorite.deleteMany({
            where: {
                productId: idProduct
            }
        })

        return 'Product has been removed from favorites'

    }

}
