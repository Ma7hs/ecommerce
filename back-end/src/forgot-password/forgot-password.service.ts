import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class ForgotPasswordService {

  constructor(private readonly prismaService: PrismaService) { }

  async forgotPassword(email: string) {

    var nodemailer = require('nodemailer')

    const user = await this.prismaService.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new NotFoundException()
    }

    const token = await jwt.sign({ id: user.id }, process.env.JSON_WEB_TOKEN_SECRET, { expiresIn: "1000000" })
    console.log(token)

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    var mailOptions = {
      from: "Equipe Easy4U",
      to: email,
      subject: `Solicitação de redefinição de senha`,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exemplo de Email Atrativo</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin-left: 600px; margin-right: 600px; padding: 0">
      
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td style="background-color: #FF6C44; text-align: center; padding: 20px;">
                      <h1 style="color: #ffffff;">Recuperação de Senha</h1>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px; text-align: center;">
                      <p>Olá,</p>
                      <p>Recebemos uma solicitação para redefinir a senha da conta da Easy4U associada a este endereço de e-mail. Clique no link abaixo para redefinir a senha usando nosso servidor seguro</p>
                      <p><a href="http://localhost:8080/forgot-password/${user.id}/${token}" style="display: inline-block; background-color: #FF6C44; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a></p>
                      <p>Se clicar no link não funcionar, copie-o e cole-o na barra de endereço do navegador. Você poderá criar uma nova senha para sua conta da Easy4U após clicar no link acima.</p>
                      <p>Se você não solicitou a redefinição da senha, pode ignorar este email.</p>
                      <p>Obrigado!</p>
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #FF6C44; text-align: center; padding: 20px;">
                      <p style="color: #ffffff;">© 2023 Equipe Easy4U</p>
                  </td>
              </tr>
          </table>
      
      </body>
      </html>`,
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

  async updatePassword(id: number,password: string){
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user){
      throw new NotFoundException()
    }

    await this.prismaService.user.update({
      where: user,
      data: {
        password: password
      }
    })

    return `Password from ${user.name} has been updated`

  }
}
