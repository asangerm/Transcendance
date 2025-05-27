import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  providers: [UsersService, PrismaService], 
  controllers: [UsersController],
  exports: [UsersService], // pour que AuthModule puisse utiliser UsersService
})
export class UsersModule {}

