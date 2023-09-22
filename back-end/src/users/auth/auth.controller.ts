import { Body, Controller, Get, Param, Post, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client'
import { SignInDTO, SignUpDTO } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { GoogleOauthGuard } from 'src/guard/google-oauth.guard';
import { Request } from 'express';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

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

    @CacheKey("google")
    @CacheTTL(5)
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth() {
        console.log('Rota /auth/google acessada.');
    }

    @CacheKey("google")
    @CacheTTL(5)
    @UseInterceptors(CacheInterceptor)
    @UseGuards(GoogleOauthGuard)
    @Get('google/redirect')
    async googleAuthRedirect(@Req() req: Request) {
        console.log(req)
        // return await this.authService.googleLogin(req.user);
    }


}
