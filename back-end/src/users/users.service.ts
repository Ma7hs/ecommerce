import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsers } from './interface/users.interface';

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

    async getAllUsers(filters: FilterUsers){
        return await this.prismaService.user.findMany({
            select: {
                ...selectUsers,
            },
            where: filters
        })
    }
}
