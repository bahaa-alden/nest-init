import { Module } from '@nestjs/common';
import { PermissionsService } from './services';
import { PermissionsController } from './controllers';
import { CaslAbilityFactory } from '../../shared/casl';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService, CaslAbilityFactory, PermissionRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
