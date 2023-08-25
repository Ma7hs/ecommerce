import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsers } from './interface/users.interface';
import { UsersResponseDTO } from './dto/users.dto';
import { UserType } from '@prisma/client';

const selectUsers = {
    id: true,
    name: true, 
    email: true,
    cpf: true,
    userType: true
}

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService){}

    async getAllUsers(filters: FilterUsers): Promise<UsersResponseDTO[]>{
        return await this.prismaService.user.findMany({
            select: {
                ...selectUsers,
            },
            where: filters
        })
    }

    async getUserById(id: number): Promise<UsersResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })
        if(user.userType == UserType.COLABORATOR){
            await this.prismaService.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    ...selectUsers
                }
            })
        }else{
            await this.prismaService.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    ...selectUsers,
                    Customer: {
                        select: {
                            balance: true
                        }
                    }
                }
            })
        }
        return user
    }

}
