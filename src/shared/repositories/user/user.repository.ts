import { Role } from './../../../models/roles';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserImagesRepository } from './user-images.repository';
import { defaultImage } from './../../../common';
import { CreateUserDto, UpdateUserDto, User } from '../../../models/users';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private userImagesRepository: UserImagesRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createOne(dto: CreateUserDto, role: Role) {
    const user = this.create({ ...dto, role, images: [] });
    user.images.push(this.userImagesRepository.create(defaultImage));
    await user.save();
    return user;
  }

  async findAll(withDeleted: boolean) {
    return this.find({ withDeleted, relations: { images: true, role: true } });
  }

  async findById(id: string, withDeleted = false) {
    return await this.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      withDeleted,
      relations: { images: true, role: true },
    });
  }

  async findByEmail(email: string) {
    return await this.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
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
