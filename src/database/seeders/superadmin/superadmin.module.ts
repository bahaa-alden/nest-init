import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../../models/permissions/entities/permission.entity';
import { Role } from '../../../models/roles/entities/role.entity';
import { Admin } from '../../../models/admins/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Permission, Role])],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
