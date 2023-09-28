import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CaslModule } from '../../shared/casl/casl.module';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), CaslModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
