import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../../models/permissions';
import { Role } from '../../../models/roles';
import { Admin } from '../../../models/admins';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Permission, Role])],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}