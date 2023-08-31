import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken'
import * as nodemailer from 'nodemailer'

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

    const token = await jwt.sign({ id: user.id }, process.env.JSON_WEB_TOKEN_SECRET, { expiresIn: "100000" })
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
      subject: 'ENVIANDO EMAIL PARA O MATHEUS',
      text: `http://localhost:5173/reset-password/${user.id}/${token}`
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
