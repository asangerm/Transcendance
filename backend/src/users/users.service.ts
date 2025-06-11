import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService 
{
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        displayName: createUserDto.username,
        passwordHash: createUserDto.password,
      },
    });
    console.log('User created:', user);
    return user;
  }

}
