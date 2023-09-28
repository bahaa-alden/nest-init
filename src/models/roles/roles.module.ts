import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { CaslModule } from '../../shared/casl/casl.module';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), CaslModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
