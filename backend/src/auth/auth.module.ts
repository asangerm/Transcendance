import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [UsersModule], // nécessaire pour injecter UsersService
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

