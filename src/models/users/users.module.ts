import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersController } from './controllers';
import { CitiesService } from '../cities/services';
import { CategoriesService } from '../categories/services';
import { UserRepository } from './epositories/user.repository';
import { UserPhotosRepository } from './epositories/user-photos.repository';
import { CityRepository } from '../cities/repositories';
import { CategoryRepository } from '../categories/repositories';
import { WalletRepository } from './epositories/wallet.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersService,
    CitiesService,
    CategoriesService,
    UserRepository,
    UserPhotosRepository,
    CityRepository,
    CategoryRepository,
    WalletRepository,
  ],
  exports: [UsersService, UserRepository, UserPhotosRepository],
})
export class UsersModule {}
