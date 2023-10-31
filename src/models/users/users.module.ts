import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersController } from './controllers';
import { UserRepository } from './repositories/user.repository';
import { UserImagesRepository } from './repositories/user-images.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserImagesRepository],
})
export class UsersModule {}
