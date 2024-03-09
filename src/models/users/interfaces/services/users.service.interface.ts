import { PaginatedResponse } from '../../../../common/types';
import { FavoritesDto, UpdateUserDto } from '../../dtos';
import { UserPhoto } from '../../entities/user-photo.entity';
import { User } from '../../entities/user.entity';

export interface IUsersService {
  find(
    page: number,
    limit: number,
    withDeleted?: boolean,
  ): Promise<PaginatedResponse<User> | User[]>;

  findOne(id: string, withDeleted?: boolean): Promise<User>;

  updateMe(dto: UpdateUserDto, user: User): Promise<User>;

  deleteMe(user: User): Promise<void>;

  getMyPhotos(user: User): Promise<UserPhoto[]>;

  update(id: string, dto: UpdateUserDto): Promise<User>;

  favorites(dto: FavoritesDto, user: User): Promise<User>;

  remove(id: string): Promise<void>;

  recover(id: string): Promise<User>;

  setTwoFactorAuthenticationSecret(
    twoFactorAuthenticationSecret: string,
    user: User,
  ): Promise<User>;

  turnOnTwoFactorAuthentication(user: User): Promise<User>;
}
