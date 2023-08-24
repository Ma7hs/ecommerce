import { ConflictException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUPParams } from './interface/auth.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService){}

    async singUpClient({name, email, cpf, password} : SignUPParams, userType: UserType){
        const findUniqueEmail = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        const findUniqueCPF = await this.prismaService.user.findUnique({
            where: {
                cpf: cpf
            }
        })

        if (findUniqueEmail) {
            throw new ConflictException()
        }

        if (findUniqueCPF) {
            throw new ConflictException()
        }


        const hashingPassword = await bcrypt.hash(password, 5)

        const client = await this.prismaService.user.create({
            data: {
                name,
                email,
                cpf,
                senha: hashingPassword,
                userType: userType
            }
        })
        
        return await this.generateJWT(client.name, client.id)

    }   

    async singUpColaborator({name, email, cpf, password} : SignUPParams, userType: UserType){
        const findUniqueEmail = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        const findUniqueCPF = await this.prismaService.user.findUnique({
            where: {
                cpf: cpf
            }
        })

        if (findUniqueEmail) {
            throw new ConflictException()
        }

        if (findUniqueCPF) {
            throw new ConflictException()
        }

        const hashingPassword = await bcrypt.hash(password, 5)

        const colaborator = await this.prismaService.user.create({
            data: {
                name,
                email,
                cpf,
                senha: hashingPassword,
                userType: userType
            }
        })
        
        return await this.generateJWT(colaborator.name, colaborator.id)
    }


    private async generateJWT(name: string, id: number){
        const token = jwt.sign({
            name: name,
            id: id
        }, process.env.JSON_WEB_TOKEN_SECRET, {
            expiresIn: 600
        })
        return token
    }

}
