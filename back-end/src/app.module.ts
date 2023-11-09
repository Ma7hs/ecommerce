import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module"; // Importe os módulos relevantes aqui
import { ProductsModule } from "./products/products.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { ForgotPasswordModule } from "./forgot-password/forgot-password.module";
import { CartModule } from "./cart/cart.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store'
import { UserInterceptor } from "./users/interceptors/users.interceptor";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProductsModule,
    FavoritesModule,
    ForgotPasswordModule,
    CartModule,
    PaymentModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      ttl: 10,
      host: "redis",
      port: 6379,
      refresher: {
        interval: 1000, 
        events: ["UPDATE", "DELETE"]
      },
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor 
    }
  ]
})
export class AppModule {}
