import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        displayName: createUserDto.username,
        passwordHash: createUserDto.password, 
      },
    });
  }
}
