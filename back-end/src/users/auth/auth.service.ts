import { Injectable, HttpException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUPParams, SignINParams } from './interface/auth.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async singUpClient({ name, email, password }: SignUPParams, userType: UserType) {
        const findUser = await this.findEmailByUser(email)
        
        if(findUser){
            return {message: "Uma conta com esse email já existe!", statusCode: 401}
        }
        
        const hashingPassword = await this.hashPassword(password)

        const client = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashingPassword,
                userType: userType
            }
        })

        await this.sendConfirmationEmail(email, name, client.id)
        return { message: "Por favor verifique seu email", statusCode: 201}

    }

    async singUpColaborator({ name, email, password }: SignUPParams, userType: UserType) {
        await this.findEmailByUser(email)

        const hashingPassword = await this.hashPassword(password)

        const colaborator = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashingPassword,
                userType: userType
            }
        })

        await this.sendConfirmationEmail(email, name, colaborator.id)
        return { message: "Por favor verifique seu email" }
    }

    async signUpAdmin({ name, email, password }: SignUPParams, userType: UserType) {
        await this.findEmailByUser(email)

        const hashingPassword = await this.hashPassword(password)

        const admin = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashingPassword,
                userType: userType
            }
        })

        await this.sendConfirmationEmail(email, name, admin.id)
        return { message: "Por favor verifique seu email" }
    }

    async signIn({ email, password }: SignINParams) {
        const findUser = await this.findEmailByUser(email)

        if (!findUser) {
            throw new NotFoundException({ message: "User not found" })
        }

        if (findUser.userType === UserType.CUSTOMER) {
            if (findUser.confirmed === false) {
                throw new UnauthorizedException({ message: "Por favor confirme seu email, voce nao esta autorizado a entrar!" })
            }
        } else if (!findUser) {
            throw new HttpException("Invalid Credentials", 400)
        }

        const hashedPassword = findUser.password
        const isValidPassword = await bcrypt.compare(password, hashedPassword)

        if (!isValidPassword) {
            throw new HttpException("Invalid Credentials", 400)
        }

        return this.generateJWT(findUser.name, findUser.id)
    }

    async googleLogin(req) {
        return { msg: "created" }
    }

    async verificateConfirmation(token: string) {
        const user = await jwt.decode(token, { complete: true })

        const obj = user.payload
        const result = obj[Object.keys(obj)[1]];

        const findUser = await this.prismaService.user.findUnique({
            where: {
                email: result
            }
        })

        await this.prismaService.user.update({
            where: {
                id: findUser.id
            },
            data: {
                confirmed: true
            }
        })

        const customer = await this.createClient(findUser.id)

        await this.createBalance(customer.id)

        return { message: "Email verificado com sucesso!" }

    }

    private async generateJWT(name: string, id?: number) {
        const token = jwt.sign({
            name: name,
            id: id
        }, process.env.JSON_WEB_TOKEN_SECRET, {
            expiresIn: 10000
        })
        return { statusCode: 201, message: token }
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 5);
    }

    private async createBalance(id: number) {
        return await this.prismaService.balance.create({
            data: {
                customerId: id,
                balance: 0
            }
        })
    }

    private async createClient(id: number, photo?: string) {
        return await this.prismaService.customer.create({
            data: {
                userId: id,
                photo
            }
        })
    }

    private async sendConfirmationEmail(email: string, name: string, id: number) {
        const token = await jwt.sign({
            id: id,
            email: email,
            name: name
        },
            process.env.JSON_WEB_TOKEN_SECRET,
            { expiresIn: "1000000000000000" }
        )

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: "Equipe Easy4U",
            to: email,
            subject: `Confirmação de conta Easy4U`,
            html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmação de Cadastro</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #FF6C44;
                text-align: center;
                padding: 20px;
              }
              .header h1 {
                color: #ffffff;
              }
              .content {
                background-color: #f4f4f4;
                text-align: center;
              }
              .content p {
                padding: 20px;
                text-align: center;
              }
              .button {
                display: inline-block;
                background-color: #FF6C44;
                color: #ffffff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
              }
              .footer {
                background-color: #FF6C44;
                text-align: center;
                padding: 20px;
              }
              .footer p {
                color: #ffffff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Confirme seu Cadastro</h1>
              </div>
              <div class="content">
                <p>Olá, ${name}</p>
                <p>Parabéns por se cadastrar em nossa plataforma! Para ativar sua conta, clique no botão abaixo:</p>
                <p><a class="button" href="http://localhost:8080/signup/confirm/${token}">Confirmar Cadastro</a></p>
                <p>Se você não solicitou este cadastro, por favor, ignore este email.</p>
                <p>Obrigado por escolher nossa plataforma!</p>
              </div>
              <div class="footer">
                <p>© 2023 Equipe Easy4U</p>
              </div>
            </div>
          </body>
          </html>
          `,
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

    public async findEmailByUser(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        return user
    }

    public async googleSignIn(email: string, name: string, status: boolean, photo: string, token: string) {
        const user = await this.findEmailByUser(email);
        const password = await this.hashPassword(token)

        if (!user) {
            let user = await this.prismaService.user.create({
                data: {
                    name,
                    email,
                    userType: UserType.CUSTOMER,
                    confirmed: status,
                    password
                }
            })

            let client = await this.createClient(user.id, photo)
            await this.createBalance(client.id)

            return await this.generateJWT(user.name, user.id)
        }

        return await this.generateJWT(user.name, user.id)

    }

}
