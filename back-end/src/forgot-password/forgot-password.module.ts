import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { PrismaService } from '../prisma/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [ForgotPasswordService, PrismaService,  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [ForgotPasswordController],
  exports: [ForgotPasswordService]
})
export class ForgotPasswordModule {}
