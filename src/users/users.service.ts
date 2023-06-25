import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  async updateUser(userId: string, dto: UpdateUserDto) {
    return 'user';
  }
}
