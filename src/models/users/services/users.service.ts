import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FavoritesDto, UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { Entities } from './../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { ICitiesService } from '../../cities/interfaces/services/cities.service.interface';
import { CITY_TYPES } from '../../cities/interfaces/type';
import { IUsersService } from '../interfaces/services/users.service.interface';
import { PaginatedResponse } from '../../../common/types';
import { UserPhoto } from '../entities/user-photo.entity';
import { IUserRepository } from '../interfaces/repositories/user.repository.interface';
import { USER_TYPES } from '../interfaces/type';
import { ICategoriesService } from '../../categories/interfaces/services/categories.service.interface';
import { CATEGORY_TYPES } from '../../categories/interfaces/type';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_TYPES.repository.user)
    private userRepository: IUserRepository,
    @Inject(CATEGORY_TYPES.service)
    private categoriesService: ICategoriesService,
    @Inject(CITY_TYPES.service) private citiesService: ICitiesService,
  ) {}

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<User> | User[]> {
    return this.userRepository.find(page, limit, withDeleted);
  }

  async findOne(id: string, withDeleted = false): Promise<User> {
    const user = await this.userRepository.findOneById(id, withDeleted);
    if (!user) throw new NotFoundException(item_not_found(Entities.User));
    return user;
  }

  async updateMe(dto: UpdateUserDto, user: User): Promise<User> {
    const updateUser = await this.userRepository.update(user, dto);
    return updateUser;
  }

  async deleteMe(user: User): Promise<void> {
    await this.userRepository.remove(user);
  }
  async getMyPhotos(user: User): Promise<UserPhoto[]> {
    return this.userRepository.getMyPhotos(user.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updateUser = await this.userRepository.update(user, dto);
    return updateUser;
  }

  async favorites(dto: FavoritesDto, user: User): Promise<User> {
    let favoriteCities: any = [];
    let favoriteCategories = [];

    if (dto.favoriteCities)
      favoriteCities = await this.citiesService.find(dto.favoriteCities);

    if (dto.favoriteCategories)
      favoriteCategories = await this.categoriesService.find(
        dto.favoriteCategories,
      );
    return this.userRepository.updateFavorites(
      user,
      favoriteCities,
      favoriteCategories,
    );
  }

  async recover(id: string): Promise<User> {
    const user = await this.findOne(id, true);
    if (!user) throw new NotFoundException(item_not_found(Entities.User));
    await this.userRepository.recover(user);
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return;
  }

  async setTwoFactorAuthenticationSecret(
    twoFactorAuthenticationSecret: string,
    user: User,
  ) {
    return this.userRepository.update(user, { twoFactorAuthenticationSecret });
  }

  async turnOnTwoFactorAuthentication(user: User) {
    return this.userRepository.update(user, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }
}
