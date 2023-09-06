import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BalanceService } from './balance/balance.service';
import { BalanceController } from './balance/balance.controller';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [PrismaService, AuthService, UsersService, BalanceService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [AuthController, UsersController, BalanceController],
  exports: [UsersModule, AuthService, BalanceService],
})
export class UsersModule { }
