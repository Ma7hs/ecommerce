import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserType} from '@prisma/client'
import { SignUpDTO } from './dto/auth.dto';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("signup/customer")
    createCostumer(
        @Body() body: SignUpDTO
    ){
        return this.authService.singUpClient(body, UserType.CUSTOMER)
    }

    @Post("signup/colaborator")
    async createColaborator(
        @Body() body: SignUpDTO
    ){
        return this.authService.singUpColaborator(body, UserType.COLABORATOR)
    }



}
