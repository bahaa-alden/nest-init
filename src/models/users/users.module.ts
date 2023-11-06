import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersController } from './controllers';
import {
  UserImagesRepository,
  UserRepository,
} from '../../shared/repositories';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserImagesRepository],
})
export class UsersModule {}
