import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../../shared/casl';
import { Permission } from '../permissions';
import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), CaslModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
