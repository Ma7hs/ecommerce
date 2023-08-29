import { Injectable, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsers, UpdateUsersParams } from './interface/users.interface';
import { UsersResponseDTO } from './dto/users.dto';
import { UserType } from '@prisma/client';


const userSelect = {
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
        const users = await this.prismaService.user.findMany({
            select: {
                ...userSelect
            },
            where: filters
        });

        if (!users) {
            throw new NotFoundException()
        }

        return users.map((user) => { return new UsersResponseDTO(user) })
    }

    async getUserById(id: number): Promise<UsersResponseDTO>{
        const user =  await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })

        if(!user){
            throw new NotFoundException()
        }

        if(user.userType == UserType.COLABORATOR){
            const colaborator = await this.prismaService.user.findUnique({
                select: {
                    ...userSelect
                },
                where: user
            })
            return new UsersResponseDTO(colaborator)
        } else if (user.userType == UserType.CUSTOMER) {
            const customer = await this.prismaService.user.findUnique({
                select: {
                    ...userSelect,
                    Customer: {
                        select: {
                            balance:{
                                select: {
                                    balance: true
                                }
                            },
                            photo: true
                        }
                    }
                },
                where: user
            });
        
            if (!customer) {
                throw new NotFoundException();
            }

            const userResponse = {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                cpf: customer.cpf,
                userType: customer.userType,
                photo: customer.Customer[0]?.photo || null,
                balance: customer.Customer[0]?.balance.map(i => i.balance) || 0
            };

            return new UsersResponseDTO(userResponse);
        }
    }

    async updateUser(data: UpdateUsersParams, id: number): Promise<UsersResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })

        if(!user){
            throw new NotFoundException()
        }

        const updateUser = await this.prismaService.user.update({
            data: data,
            where: {
                id: id
            }
        })

        return new UsersResponseDTO(updateUser)

    }

    

    async deleteUser(id: number){
        const user =  await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })

        if(!user){
            throw new UnauthorizedException()
        }

        const customer = await this.prismaService.customer.findFirst({
            where: {
                userId: user.id
            }
        })
   
        await this.prismaService.balance.deleteMany({
            where: {
                customerId: customer.id
            }   
        })

        await this.prismaService.movementExtract.deleteMany({
            where: {
                customerId: customer.id
            }
        })
        await this.prismaService.customer.deleteMany({
            where: {
                userId: user.id
            }  
        })
        await this.prismaService.user.delete({
            where: {
                id: id
            }
        })

        return "User has been deleted"
    }
}
