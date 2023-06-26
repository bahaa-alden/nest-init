import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number, email?: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.usersRepository.update(id, dto);
  }
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
