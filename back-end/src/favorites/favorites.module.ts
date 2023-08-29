import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesService } from './favorites.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [FavoritesService, PrismaService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [FavoritesController],
  exports: [FavoritesService]
})
export class FavoritesModule {}
