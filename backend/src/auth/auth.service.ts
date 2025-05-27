import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...rest } = user;
    return {
      message: 'Utilisateur créé en base',
      user: rest,
    };
  }
}


