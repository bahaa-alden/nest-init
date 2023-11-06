import { UserRepository } from './../../../shared/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { ROLE } from './../../../common';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  findAll(user: User) {
    if (user.role.name === ROLE.ADMIN || user.role.name === ROLE.SUPER_ADMIN)
      return this.userRepository.findAll(true);

    return this.userRepository.findAll(false);
  }

  async findOne(id: string, withDeleted = false) {
    const user = await this.userRepository.findById(id, withDeleted);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    const updateUser = await this.userRepository.updateOne(user, dto);
    return updateUser;
  }

  async deleteMe(user: User) {
    return user.softRemove();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updateUser = await this.userRepository.updateOne(user, dto);
    return updateUser;
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    return user.softRemove();
  }

  async recover(id: string) {
    const user = await this.findOne(id, true);
    if (!user) throw new NotFoundException('user not found');
    await user.recover();
    return user;
  }
}
