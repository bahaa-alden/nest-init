import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { ROLE } from './../../../common/enums';
import { UserRepository } from '../../../shared/repositories/user';
import { ICrud } from '../../../common/interfaces';

@Injectable()
export class UsersService implements ICrud<User> {
  constructor(private userRepository: UserRepository) {}

  create(...n: any[]): Promise<User> {
    return;
  }
  get(page: number, limit: number, user: User) {
    if (user.role.name === ROLE.ADMIN || user.role.name === ROLE.SUPER_ADMIN)
      return this.userRepository.findAll(page, limit, true);

    return this.userRepository.findAll(page, limit, false);
  }

  async getOne(id: string, withDeleted = false) {
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
    const user = await this.getOne(id);
    const updateUser = await this.userRepository.updateOne(user, dto);
    return updateUser;
  }

  async remove(id: string) {
    const user = await this.getOne(id);
    await user.softRemove();
    return;
  }

  async recover(id: string) {
    const user = await this.getOne(id, true);
    if (!user) throw new NotFoundException('user not found');
    await user.recover();
    return user;
  }
}
