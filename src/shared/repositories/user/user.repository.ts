import { Role } from './../../../models/roles';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPhotosRepository } from './user-photos.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserPhoto,
} from '../../../models/users';
import { defaultPhoto } from '../../../common/constants';
import { pagination } from '../../../common/helpers';
import { PasswordChangeDto, ResetPasswordDto } from '../../../auth';
import { PaginatedResponse } from '../../../common/types';
import { City } from '../../../models/cities';
import { Category } from '../../../models/categories';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private userPhotosRepository: UserPhotosRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createOne(dto: CreateUserDto, role: Role): Promise<User> {
    const user = this.create({ ...dto, role, photos: [] });
    user.photos.push(this.userPhotosRepository.create(defaultPhoto));
    await user.save();
    return user;
  }

  async findAll(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.find({
      relations: { photos: true, role: true },
      skip,
      take,
      withDeleted,
    });
    const totalDataCount = await this.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findByIdOrEmail(ie: string, withDeleted = false): Promise<User> {
    return await this.findOne({
      where: [{ id: ie }, { email: ie }],
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        favoriteCategories: { id: true, name: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        favoriteCategories: true,
        favoriteCities: true,
      },
    });
  }

  async findByIdOrEmailForThings(id: string): Promise<User> {
    return await this.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      relations: { photos: true },
    });
  }

  async updateOne(user: User, dto: UpdateUserDto): Promise<User> {
    user.photos.push(await this.userPhotosRepository.uploadPhoto(dto.photo));
    Object.assign(user, { email: dto.email, name: dto.name });
    await this.save(user);
    return this.findByIdOrEmail(user.id);
  }

  async updateFavorites(
    user: User,
    favoriteCities: City[],
    favoriteCategories: Category[],
  ): Promise<User> {
    user.favoriteCategories.push(...favoriteCategories);
    user.favoriteCities.push(...favoriteCities);
    await this.save(user);
    return this.findByIdOrEmail(user.id);
  }

  async resetPassword(
    user: User,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<User> {
    user.password = dto.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await this.save(user);
    return this.findByIdOrEmail(user.id);
  }

  async getMyPhotos(userId: string): Promise<UserPhoto[]> {
    return this.userPhotosRepository.find({ where: { userId } });
  }

  async validate(id: string) {
    return this.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        passwordChangedAt: true,
        role: {
          id: true,
          name: true,
          permissions: {
            id: true,
            action: true,
            subject: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        photos: false,
        favoriteCategories: { id: true, name: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        favoriteCategories: true,
        favoriteCities: true,
      },
    });
  }
}
