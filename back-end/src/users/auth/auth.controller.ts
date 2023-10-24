import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client'
import { SignInDTO, SignUpDTO } from './dto/auth.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

import { GoogleOauthGuard } from '../../guard/google-oauth.guard';
import { User } from '../decorator/user.decorator';
import { UserInfo } from '../../users/interface/users.interface';
import { AuthGuard } from '../../guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post("signup/customer")
    createCostumer(
        @Body() body: SignUpDTO
    ) {
        return this.authService.singUpClient(body, UserType.CUSTOMER)
    }

    @Post("signup/colaborator")
    createColaborator(
        @Body() body: SignUpDTO
    ) {
        return this.authService.singUpColaborator(body, UserType.COLABORATOR)
    }

    @Post("signup/admin")
    createAdmin(
        @Body() body: SignUpDTO
    ) {
        return this.authService.signUpAdmin(body, UserType.ADMIN)
    }

    @Post("signup/confirm/:token")
    confirmEmailFromUser(
        @Param("token") token: string
    ) {
        return this.authService.verificateConfirmation(token)
    }

    @Post('signin')
    loginUser(
        @Body() body: SignInDTO
    ) {
        return this.authService.signIn(body)
    }

    @Roles(UserType.ADMIN, UserType.COLABORATOR, UserType.CUSTOMER)
    @UseGuards(AuthGuard)
    @Get("/me")
    me(
        @User() user: UserInfo        
    ){
        return this.authService.me(user.id)
    }

}