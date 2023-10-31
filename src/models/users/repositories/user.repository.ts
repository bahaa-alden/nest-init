import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos';
import { UserImagesRepository } from './user-images.repository';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private userImagesRepository: UserImagesRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findAll(withDeleted: boolean) {
    return this.find({ withDeleted, relations: { images: true, role: true } });
  }

  async findById(id: string, withDeleted = false) {
    return await this.findOne({
      where: { id },
      withDeleted,
      relations: { images: true, role: true },
    });
  }

  async updateOne(user: User, dto: UpdateUserDto) {
    user.images.push(await this.userImagesRepository.updatePhoto(dto.photo));
    Object.assign(user, { email: dto.email, name: dto.name });
    await this.save(user);
    return this.findById(user.id);
  }
}
