import { Controller, Get, HttpCode, Param, Query, ParseIntPipe } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    @HttpCode(201)
    getAllUsers(
        @Query('userType') userType?: UserType
    ){
        const filters = {
            ...(userType && {userType})
        }
        return this.usersService.getAllUsers(filters)
    }    

    @Get(':id')
    @HttpCode(201)
    getUserById(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.usersService.getUserById(id)
    }


}
