import { Global, Module } from '@nestjs/common';
import { RolesController } from './controllers';
import { RolesService } from './services';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
