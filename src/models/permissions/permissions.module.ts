import { Module } from '@nestjs/common';
import { PermissionsService } from './services';
import { PermissionsController } from './controllers';
import { PermissionRepository } from './repositories';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepository],
  exports: [PermissionsService, PermissionRepository],
})
export class PermissionsModule {}
