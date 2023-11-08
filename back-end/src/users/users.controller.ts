import { Controller, Get, HttpCode, Param, Query, ParseIntPipe, Patch, Body, Delete, Inject, UseInterceptors, ParseEnumPipe, UseGuards } from '@nestjs/common';
import { CacheKey, CacheInterceptor, CacheTTL  } from '@nestjs/cache-manager'; 
import { UserType } from '@prisma/client';
import { UsersService } from './users.service';
import { UsersResponseDTO, UpdateUserDTO } from './dto/users.dto';
import { User } from './decorator/user.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { UserInfo } from './interface/users.interface';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    // @UseInterceptors(CacheInterceptor)
    // @CacheTTL(10)
    // @CacheKey("all-users")
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

    @Patch()
    updateUser(
        @Body() body: UpdateUserDTO,
        @User() user: UserInfo
    ): Promise<unknown>{
        console.log({body, user})
        return this.usersService.updateUser(body, user.id)
    }
    
    @Delete(":id")
     deleteUser(
        @Param("id", ParseIntPipe) id: number
    ): Promise<Object> {
        return this.usersService.deleteUser(id)
    }

    

}
