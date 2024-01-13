import { Role } from '../../roles';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPhotosRepository } from './user-photos.repository';
import { CreateUserDto, UpdateUserDto, User, UserPhoto } from '..';
import { defaultPhoto } from '../../../common/constants';
import { pagination } from '../../../common/helpers';
import { PasswordChangeDto, ResetPasswordDto } from '../../../auth';
import { PaginatedResponse } from '../../../common/types';
import { City } from '../../cities';
import { Category } from '../../categories';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class UserRepository {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly userPhotosRepository: UserPhotosRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(dto: CreateUserDto, role: Role): Promise<User> {
    const wallet = this.walletRepository.create({});
    const user = this.userRepository.create({
      ...dto,
      role,
      photos: [],
      wallet,
    });
    user.photos.push(this.userPhotosRepository.create(defaultPhoto));
    await user.save();
    return user;
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.userRepository.find({
      relations: { photos: true, role: true },
      skip,
      take,
      withDeleted,
    });
    const totalDataCount = await this.userRepository.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOne(id: string, withDeleted = false): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        favoriteCategories: { id: true, name: true },
        favoriteCities: { id: true, name: true },
        wallet: { id: true, total: true, pending: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        favoriteCategories: true,
        favoriteCities: true,
        wallet: true,
      },
      withDeleted,
    });
  }

  async findByEmail(email: string, withDeleted = false): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        favoriteCategories: { id: true, name: true },
        favoriteCities: { id: true, name: true },
        wallet: { id: true, total: true, pending: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        favoriteCategories: true,
        favoriteCities: true,
        wallet: true,
      },
      withDeleted,
    });
  }
  async findByIdForThings(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      relations: { photos: true },
    });
  }

  async update(user: User, dto: UpdateUserDto): Promise<User> {
    user.photos.push(await this.userPhotosRepository.uploadPhoto(dto.photo));
    Object.assign(user, { email: dto.email, name: dto.name });
    await this.userRepository.save(user);
    return this.findOne(user.id);
  }

  async updateFavorites(
    user: User,
    favoriteCities: City[],
    favoriteCategories: Category[],
  ): Promise<User> {
    user.favoriteCategories.push(...favoriteCategories);
    user.favoriteCities.push(...favoriteCities);
    await this.userRepository.save(user);
    return this.findOne(user.id);
  }

  async resetPassword(
    user: User,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<User> {
    user.password = dto.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await this.userRepository.save(user);
    return this.findOne(user.id);
  }

  async getMyPhotos(userId: string): Promise<UserPhoto[]> {
    return this.userPhotosRepository.find({ where: { userId } });
  }

  async validate(id: string) {
    return this.userRepository.findOne({
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
        favoriteCities: { id: true, name: true },
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
