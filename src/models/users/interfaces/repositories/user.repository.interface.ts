import { ResetPasswordDto, PasswordChangeDto } from '../../../../auth';
import { PaginatedResponse } from '../../../../common/types';
import { Category } from '../../../categories';
import { City } from '../../../cities';
import { Role } from '../../../roles';
import { CreateUserDto, UpdateUserDto } from '../../dtos';
import { UserPhoto } from '../../entities/user-photo.entity';
import { User } from '../../entities/user.entity';

export interface IUserRepository {
  find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<User> | User[]>;

  findOneById(id: string, withDeleted: boolean): Promise<User>;

  findOneByEmail(email: string, withDeleted?: boolean): Promise<User>;

  findOneByIdForThings(id: string): Promise<User>;

  findOneByResetToken(hashToken: string): Promise<User>;

  create(dto: CreateUserDto, role: Role): Promise<User>;

  update(user: User, dto: UpdateUserDto): Promise<User>;

  updateFavorites(
    user: User,
    favoriteCities: City[],
    favoriteCategories: Category[],
  ): Promise<User>;

  resetPassword(
    user: User,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<User>;

  getMyPhotos(userId: string): Promise<UserPhoto[]>;

  recover(user: User): Promise<User>;

  remove(user: User): Promise<void>;

  validate(id: string): Promise<User>;
}
