import { Role } from '../../roles';
import { Inject, Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDto, User, UserPhoto } from '..';
import { defaultPhoto } from '../../../common/constants';
import { pagination } from '../../../common/helpers';
import { PasswordChangeDto, ResetPasswordDto } from '../../../auth';
import { PaginatedResponse } from '../../../common/types';
import { City } from '../../cities';
import { Category } from '../../categories';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../interfaces/repositories/user.repository.interface';
import { IUserPhotosRepository } from '../interfaces/repositories/user-photos.repository.interface';
import { USER_TYPES } from '../interfaces/type';
import { IWalletRepository } from '../interfaces/repositories/wallet.repository.interface';
import { BaseAuthRepo } from '../../../common/entities';

@Injectable()
export class UserRepository
  extends BaseAuthRepo<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(USER_TYPES.repository.user_photos)
    private readonly userPhotosRepository: IUserPhotosRepository,
    @Inject(USER_TYPES.repository.wallet)
    private readonly walletRepository: IWalletRepository,
  ) {
    super(userRepo);
  }

  async create(dto: CreateUserDto, role: Role): Promise<User> {
    const wallet = this.walletRepository.create();
    const user = this.userRepo.create({ ...dto, role, wallet, photos: [] });
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
    const data = await this.userRepo.find({
      relations: { photos: true, role: true },
      skip,
      take,
      withDeleted,
    });
    const totalDataCount = await this.userRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneByResetToken(hashToken: string) {
    return this.userRepo.findOne({
      where: {
        passwordResetToken: hashToken,
        passwordResetExpires: MoreThan(new Date()),
      },
      select: {
        passwordChangedAt: true,
        passwordResetExpires: true,
        passwordResetToken: true,
        password: true,
        id: true,
        name: true,
      },
    });
  }

  async findOneByIdForThings(id: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      relations: { photos: true },
    });
  }

  async update(user: User, dto: any): Promise<User> {
    if (dto.photo)
      user.photos.push(await this.userPhotosRepository.uploadPhoto(dto.photo));
    await this.userRepo.update(user.id, dto);
    return this.findOneById(user.id);
  }

  async updateFavorites(
    user: User,
    favoriteCities: City[],
    favoriteCategories: Category[],
  ): Promise<User> {
    user.favoriteCategories.push(...favoriteCategories);
    user.favoriteCities.push(...favoriteCities);
    await this.userRepo.save(user);
    return this.findOneById(user.id);
  }

  async resetPassword(
    user: User,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<User> {
    user.password = dto.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await this.userRepo.save(user);
    return this.findOneById(user.id);
  }

  async getMyPhotos(userId: string): Promise<UserPhoto[]> {
    return this.userPhotosRepository.findPhotosByUser(userId);
  }

  async recover(user: User): Promise<User> {
    return this.userRepo.recover(user);
  }
  async remove(user: User): Promise<void> {
    this.userRepo.softRemove(user);
  }
}
