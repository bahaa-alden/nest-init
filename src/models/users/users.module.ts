import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersController } from './controllers';
import {
  UserPhotosRepository,
  UserRepository,
} from '../../shared/repositories/user';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserPhotosRepository],
  exports: [UsersService],
})
export class UsersModule {}
