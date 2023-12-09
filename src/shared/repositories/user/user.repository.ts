import { Role } from './../../../models/roles';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPhotosRepository } from './user-photos.repository';
import { CreateUserDto, UpdateUserDto, User } from '../../../models/users';
import { defaultPhoto } from '../../../common/constants';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private userPhotosRepository: UserPhotosRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createOne(dto: CreateUserDto, role: Role) {
    const user = this.create({ ...dto, role, photos: [] });
    user.photos.push(this.userPhotosRepository.create(defaultPhoto));
    await user.save();
    return user;
  }

  async findAll(withDeleted: boolean) {
    return this.find({ withDeleted, relations: { photos: true, role: true } });
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
      relations: { photos: true, role: true },
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
      relations: { photos: true, role: true },
    });
  }

  async updateOne(user: User, dto: UpdateUserDto) {
    user.photos.push(await this.userPhotosRepository.uploadPhoto(dto.photo));
    Object.assign(user, { email: dto.email, name: dto.name });
    await this.save(user);
    return this.findById(user.id);
  }
}