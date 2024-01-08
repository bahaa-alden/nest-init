import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoritesDto, UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { Entities, ROLE } from './../../../common/enums';
import { UserRepository } from '../epositories';
import { ICrud } from '../../../common/interfaces';
import { item_not_found } from '../../../common/constants';
import { CategoriesService } from '../../categories/services/categories.service';
import { CitiesService } from '../../cities/services/cities.service';

@Injectable()
export class UsersService implements ICrud<User> {
  constructor(
    private userRepository: UserRepository,
    private categoriesService: CategoriesService,
    private citiesService: CitiesService,
  ) {}

  create(...n: any[]): Promise<User> {
    return;
  }
  get(page: number, limit: number, withDeleted: boolean) {
    return this.userRepository.findAll(page, limit, withDeleted);
  }

  async getOne(id: string, withDeleted = false) {
    const user = await this.userRepository.findById(id, withDeleted);
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
    let favoriteCities = [];
    let favoriteCategories = [];

    if (dto.favoriteCities)
      favoriteCities = await this.citiesService.get(dto.favoriteCities);

    if (dto.favoriteCategories)
      favoriteCategories = await this.categoriesService.get(
        dto.favoriteCategories,
      );
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
