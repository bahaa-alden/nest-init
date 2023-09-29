import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CaslAbilityFactory } from '../../shared/casl/casl-ability.factory';
import { ROLE } from '../../common/enums';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(user: User) {
    if (user.role.name === ROLE.SUPER_ADMIN || user.role.name === ROLE.ADMIN) {
      return this.userRepository.find({ withDeleted: true });
    }
    return this.userRepository.find();
  }

  findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async delete(id: string) {
    return this.userRepository.softDelete(id);
  }

  async recover(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) throw new NotFoundException('user not found');
    await this.userRepository.recover(user);
    return user;
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    Object.assign(user, dto);
    await this.userRepository.update(user.id, user);
    return this.findById(user.id);
  }

  async deleteMe(user: User) {
    await this.userRepository.softDelete(user.id);
    return;
  }
}
