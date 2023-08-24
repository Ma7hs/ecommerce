import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [PrismaService, AuthService, UsersService],
  controllers: [AuthController, UsersController],
  exports: [UsersModule, AuthService]
})
export class UsersModule {}
