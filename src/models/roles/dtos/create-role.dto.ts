import { IsArray, IsOptional, IsUUID, NotEquals } from 'class-validator';
import { Entities, ROLE } from '../../../common';
import { UUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist, IsUnique } from '../../../common';

export class CreateRoleDto {
  @ApiProperty({ description: 'the rule name' })
  @IsUnique(Entities.Role)
  @NotEquals(ROLE.SUPER_ADMIN)
  name: string;

  @ApiProperty({ description: 'the Ids of permissions' })
  @IsOptional()
  @IsUUID('all', { each: true })
  @IsArray({ message: 'must be an array' })
  permissions: string[];
}
