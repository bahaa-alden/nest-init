import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/users/entities/users.entity';
import { Permission } from '../../models/permissions/entities/permission.entity';
import { Role } from '../../models/roles/entities/role.entity';

@Module({
  imports: [],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
