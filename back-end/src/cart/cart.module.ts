import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimingController } from './timing/timing.controller';

@Module({
  providers: [CartService, PrismaService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [CartController, TimingController],
  exports: [CartService]
})
export class CartModule {}
