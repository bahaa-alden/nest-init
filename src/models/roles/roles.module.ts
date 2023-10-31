import { Global, Module } from '@nestjs/common';
import { RolesController } from './controllers';
import { RolesService } from './services';
import { RoleRepository } from './repositories/roles.repository';
import { PermissionsModule } from '../permissions/permissions.module';

@Global()
@Module({
  imports: [PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RoleRepository],
})
export class RolesModule {}
