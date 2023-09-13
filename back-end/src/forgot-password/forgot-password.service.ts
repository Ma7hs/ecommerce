import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      from: 'easy4u.devs@gmail.com',
      to: email,
      subject: `Enviando um email de boa noite para a ${user.name}`,
      text: 'Redefinicao de senha! <3 :)',
      // html: 'Embedded image: <img src="cid:easy4u.devs@gmail.com"/>',
      // text: `http://localhost:5173/reset-password/${user.id}/${token}`
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
