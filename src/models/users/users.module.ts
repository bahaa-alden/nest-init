import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserImage } from './entities';
import { CaslModule } from '../../shared/casl';
import { CloudinaryModule } from '../../shared/cloudinary';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserImage]),
    CaslModule,
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
