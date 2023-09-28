import {
  IsEnum,
  IsJSON,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';
import { Action, Entities, ROLE } from '../../../common/enums';
import { IPermission } from '../interfaces/permissions.interface';

import { UUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto implements IPermission {
  @ApiProperty({ enum: Action })
  @IsEnum(Action)
  action: Action;

  @ApiProperty({ enum: Entities })
  @IsEnum(Entities)
  @NotEquals(Entities.All)
  subject: Entities;
}
