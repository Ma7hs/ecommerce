import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { CartModule } from './cart/cart.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [UsersModule, ProductsModule, FavoritesModule, ForgotPasswordModule, CartModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }, RedisService],
})
export class AppModule {}
