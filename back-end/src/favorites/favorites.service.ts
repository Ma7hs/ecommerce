import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponseDTO } from './dto/favorites.dto';

@Injectable()
export class FavoritesService {

    constructor(private readonly prismaService: PrismaService){}

    async getAllFavorites(userId: number){

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        const client = await this.prismaService.customer.findFirst({
            where: {
                userId: user.id
            }
        })
        
        if(!client){
            throw new NotFoundException("Client not found")
        }

        const favorites = await this.prismaService.favorite.findMany({
            where: {
                customerId: client.id
            },
            select: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        price: true
                    }
                },
            }
        })

        return favorites

    }

    async createFavorite(idUser: number, idProduct: number){

        const user = await this.prismaService.user.findUnique({
            where: {
                id: idUser
            }
        })


        const client = await this.prismaService.customer.findFirst({
            where: {
                userId: user.id
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

        const findProducts = await this.prismaService.favorite.findFirst({
            where: {
                productId: product.id,
                customerId: client.id
            }
        })

        if(findProducts){
            throw new BadRequestException()
        }
       
        await this.prismaService.favorite.create({
            data: {
                productId: product.id,
                customerId: client.id
            }
        })
        
        return {message: "Favorito adicionado com sucesso!", statusCode: 201}

    }

    async deleteFavorite(idUser: number, idProduct: number){
        const client = await this.prismaService.user.findUnique({
            where: {
                id: idUser
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

        return {message: "Produto excluido com sucesso!", statusCode: 201}

    }

}
