import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import {ProductService} from './products.service'
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [ProductService, PrismaService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [ProductsController],
  exports: [ProductService]
})
export class ProductsModule {}
