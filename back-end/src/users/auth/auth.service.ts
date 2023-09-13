import { ConflictException, Injectable, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUPParams, SignINParams } from './interface/auth.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) { }

    async singUpClient({ name, email, password }: SignUPParams, userType: UserType) {
        const user = await this.findEmailByUser(email)
        console.log(user)

        const hashingPassword = await bcrypt.hash(password, 5);

        const client = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashingPassword,
                userType: userType
            }
        })

        this.sendConfirmationEmail(email, name, client.id)


        // const customer = await this.prismaService.customer.create({
        //     data: {
        //         userId: client.id
        //     }
        // })

        // await this.prismaService.balance.create({
        //     data: {
        //         customerId: customer.id,
        //         balance: 0
        //     }
        // })

        return await this.generateJWT(client.name, client.id)
    }

    async singUpColaborator({ name, email, password }: SignUPParams, userType: UserType) {
        this.findEmailByUser(email)

        const hashingPassword = await bcrypt.hash(password, 5)

        const colaborator = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashingPassword,
                userType: userType
            }
        })

        return await this.generateJWT(colaborator.name, colaborator.id)
    }

    async signIn({ email, password }: SignINParams) {
        

        const findUser = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(findUser.confirmed === false) {
            throw new UnauthorizedException({message: "Por favor confirme seu email, voce nao esta autorizado a entrar!"})
        }else if(!findUser){
            throw new HttpException("Invalid Credentials", 400)
        }

        const hashedPassword = findUser.password
        const isValidPassword = await bcrypt.compare(password, hashedPassword)

        if (!isValidPassword) {
            throw new HttpException("Invalid Credentials", 400)
        }

        return this.generateJWT(findUser.name, findUser.id)
    }

    async verificateConfirmation(token: string){
        const user = await jwt.decode(token, {complete: true})
        
        const obj = (user.payload)
        var result = obj[Object.keys(obj)[0]];
        console.log(result)
        
        const findUser = await this.findEmailByUser(result.email)

        await this.prismaService.user.update({
            where: {
                id: findUser.id
            },
            data: {
                confirmed: true
            }
        })
    }

    private async generateJWT(name: string, id?: number) {
        const token = jwt.sign({
            name: name,
            id: id
        }, process.env.JSON_WEB_TOKEN_SECRET, {
            expiresIn: 600
        })
        return token
    }

    private async findEmailByUser(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        console.log(user)

        if (user) {
            throw new ConflictException()
        };

        return user
    }

    private async sendConfirmationEmail(email: string, name: string, id: number) {
        var nodemailer = require('nodemailer')
        const tokenToEmail = await jwt.sign({ 
            id: id,
            email: email,
            name: name }, 
            process.env.JSON_WEB_TOKEN_SECRET,
            { expiresIn: "1000000" }
        )

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        var mailOptions = {
            from: 'easy4u.devs@gmail.com',
            to: email,
            subject: `Enviando um email de confirmacao de email ${email}`,
            text: `Confirmacao de email nesse link: 
        
            http://localhost/signup/confirm/${tokenToEmail}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent to:", email);
                return "Password has been updated";
            }
        });
    }

}
