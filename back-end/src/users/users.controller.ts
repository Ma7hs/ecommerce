import { Controller, Get, HttpCode, Param, Query, ParseIntPipe, Patch, Body, Delete, Inject, UseInterceptors, ParseEnumPipe } from '@nestjs/common';
import { CacheKey, CacheInterceptor, CacheTTL  } from '@nestjs/cache-manager'; 
import { UserType } from '@prisma/client';
import { UsersService } from './users.service';
import { UsersResponseDTO, UpdateUserDTO } from './dto/users.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("all-users")
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

    @Patch(':token')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDTO
    ): Promise<UsersResponseDTO>{
        return this.usersService.updateUser(body, id)
    }
    
    @Delete(":id")
     deleteUser(
        @Param("id", ParseIntPipe) id: number
    ) {
        this.usersService.deleteUser(id)
        return 'User has been deleted'
    }

}
