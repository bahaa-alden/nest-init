import { Global, Module } from '@nestjs/common';
import { RolesController } from './controllers';
import { RolesService } from './services';
import { PermissionsModule } from '../permissions/permissions.module';
import { RoleRepository } from './repositories';

@Module({
  imports: [PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService, RoleRepository],
})
export class RolesModule {}
