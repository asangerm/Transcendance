// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
})
export class AppModule {}


