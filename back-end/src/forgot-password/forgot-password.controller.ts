import { Body, Controller, Param, Post, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDTO, UpdatePasswordDTO } from './dto/forgot-password.dto';
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

@Controller('forgot-password')
export class ForgotPasswordController {

    constructor(private readonly password: ForgotPasswordService){}

    @Post()
    forgotPassword(
        @Body() {email}: ForgotPasswordDTO
    ){
        this.password.forgotPassword(email)
        return `Email sent to ${email}` 
    }

    @Post(':id/:token')
    async updatePassword(
        @Param('id', ParseIntPipe) id: number,
        @Param('token') token: string,
        @Body() {password} : UpdatePasswordDTO
    ){
        const newToken = token.split(' ')[0]
        console.log(newToken)
        console.log(id)
        console.log(password)
        await jwt.verify(newToken, process.env.JSON_WEB_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                console.log(err)
                throw new UnauthorizedException()
            } else {
                const hashPassword = await bcrypt.hash(password, 5)
                return this.password.updatePassword(id, hashPassword)
            }
        })
    }

}

