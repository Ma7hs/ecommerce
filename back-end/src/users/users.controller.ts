import { Controller, Get, HttpCode, Param, Query, ParseIntPipe, Patch, Body, Delete } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UsersService } from './users.service';
import { UsersResponseDTO, UpdateUserDTO } from './dto/users.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    @HttpCode(201)
    getAllUsers(
        @Query('userType') userType?: UserType
    ): Promise<UsersResponseDTO[]>{
        const filters = {
            ...(userType && {userType})
        }
        return this.usersService.getAllUsers(filters)
    }    

    @Get(':id')
    @HttpCode(201)
    getUserById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<UsersResponseDTO>{
        return this.usersService.getUserById(id)
    }

    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDTO
    ): Promise<UsersResponseDTO>{
        return this.usersService.updateUser(body, id)
    }
    
    @Delete(":id")
    async deleteUser(
        @Param("id", ParseIntPipe) id: number
    ) {
        await this.usersService.deleteUser(id)
        return 'User has been deleted'
    }

}
