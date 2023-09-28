import { Injectable } from '@nestjs/common';
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
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  findAll(user: User) {
    if (user.role.name === ROLE.SUPER_ADMIN || user.role.name === ROLE.ADMIN) {
      return this.usersRepository.find({ withDeleted: true });
    }
    return this.usersRepository.find();
  }

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async delete(id: string) {
    return this.usersRepository.softDelete(id);
  }

  async recover(id: string) {
    await this.usersRepository.recover({ id });
    return this.findById(id);
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    Object.assign(user, dto);
    await this.usersRepository.update(user.id, user);
    return this.findById(user.id);
  }

  async deleteMe(user: User) {
    await this.usersRepository.softDelete(user.id);
    return;
  }
}
