import { Module } from '@nestjs/common';
import {ProductService} from './products.service'
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ProductService, PrismaService],
  controllers: [ProductsController],
  exports: [ProductService]
})
export class ProductsModule {}
