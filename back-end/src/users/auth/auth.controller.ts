import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client'
import { GoogleTokenDTO, SignInDTO, SignUpDTO } from './dto/auth.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { OAuth2Client } from 'google-auth-library';
import { GoogleOauthGuard } from '../../guard/google-oauth.guard';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
)

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

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("google")
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleLogin(
        @Req() req
    ) {console.log(req)}

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("redirect")
    @Get('google/redirect')
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallback(@Req() req) {
        return await this.authService.googleLogin(req)
    }

}