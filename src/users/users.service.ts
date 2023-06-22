import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './interface';
import { User } from './schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, dto);
    if (!user) throw new NotFoundException({ message: 'User not found' });

    return user;
  }
}
