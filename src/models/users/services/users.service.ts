import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoritesDto, UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { Entities, ROLE } from './../../../common/enums';
import { UserRepository } from '../../../shared/repositories/user';
import { ICrud } from '../../../common/interfaces';
import { item_not_found } from '../../../common/constants';
import { CityRepository } from '../../../shared/repositories/city/city.repository';
import { CategoryRepository } from '../../../shared/repositories/category/category.repository';

@Injectable()
export class UsersService implements ICrud<User> {
  constructor(
    private userRepository: UserRepository,
    private cityRepository: CityRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  create(...n: any[]): Promise<User> {
    return;
  }
  get(page: number, limit: number, user: User) {
    if (user.role.name === ROLE.ADMIN || user.role.name === ROLE.SUPER_ADMIN)
      return this.userRepository.findAll(page, limit, true);

    return this.userRepository.findAll(page, limit, false);
  }

  async getOne(id: string, withDeleted = false) {
    const user = await this.userRepository.findByIdOrEmail(id, withDeleted);
    if (!user) throw new NotFoundException(item_not_found(Entities.User));
    return user;
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    const updateUser = await this.userRepository.updateOne(user, dto);
    return updateUser;
  }

  async deleteMe(user: User) {
    return user.softRemove();
  }

  async getMyPhotos(user: User) {
    return this.userRepository.getMyPhotos(user.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getOne(id);
    const updateUser = await this.userRepository.updateOne(user, dto);
    return updateUser;
  }

  async favorites(dto: FavoritesDto, user: User) {
    const favoriteCities = await this.cityRepository.findAll(
      dto.favoriteCities,
    );

    if (dto.favoriteCities.length !== favoriteCities.length)
      throw new NotFoundException(item_not_found(Entities.City));

    const favoriteCategories = await this.categoryRepository.findAll(
      dto.favoriteCategories,
    );

    if (dto.favoriteCategories.length !== favoriteCategories.length)
      throw new NotFoundException(item_not_found(Entities.Category));

    return this.userRepository.updateFavorites(
      user,
      favoriteCities,
      favoriteCategories,
    );
  }

  async remove(id: string) {
    const user = await this.getOne(id);
    await user.softRemove();
    return;
  }

  async recover(id: string) {
    const user = await this.getOne(id, true);
    if (!user) throw new NotFoundException(item_not_found(Entities.User));
    await user.recover();
    return user;
  }
}
